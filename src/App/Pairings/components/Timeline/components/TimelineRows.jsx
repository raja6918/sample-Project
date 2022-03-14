import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import debounce from 'lodash/debounce';

import { ROW_HEIGHT, MIN_ROWS_NUMBER, DEBUG_MODE } from './../constants';
import { PairingObject } from './';
import { elementsCollide } from './../helpers';

import { TimelineContext } from './../TimelineContext';

class TimelineRows extends Component {
  rowRef = React.createRef();

  shouldComponentUpdate(nextProps) {
    const { index, scrollTop } = this.props;

    let targetObjects = 'pairings';

    if (index === 1) {
      targetObjects = 'flights';
    }

    if (scrollTop !== nextProps.scrollTop && nextProps.isZoomed) {
      return true;
    }

    if (this.props[targetObjects].length !== nextProps[targetObjects].length) {
      return true;
    }

    if (this.props.timelineWindowHeight !== nextProps.timelineWindowHeight)
      return true;

    if (this.props.columnWidthInPx !== nextProps.columnWidthInPx) {
      return true;
    }

    const currentMissing = this.props[targetObjects].filter(e => e._empty)
      .length;
    const nextMissing = nextProps[targetObjects].filter(e => e._empty).length;

    if (currentMissing !== nextMissing) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.processPairingNameLabels();
  }

  componentDidUpdate(prevProps) {
    this.debouncedProcessLabels();
  }

  processPairingNameLabels() {
    let timeStart;

    if (DEBUG_MODE) {
      timeStart = Date.now();
    }

    if (this.rowRef && this.rowRef.current) {
      const rows = this.rowRef.current.getElementsByClassName('pairings-row');

      const rowsCount = rows.length;

      for (let rowIdx = 0; rowIdx < rowsCount; rowIdx++) {
        const pairingNameLabels = rows[rowIdx].getElementsByClassName(
          'pairing-name'
        );

        this.processLabelsRow(pairingNameLabels);
      }
    }

    if (!DEBUG_MODE) return;

    const elapsedTime = (Date.now() - timeStart) / 1000;
    // eslint-disable-next-line
    console.log('>>> Show/Hide pairing name time:', `${elapsedTime} seconds`);
  }

  processLabelsRow = rowLabels => {
    const labelsCount = rowLabels.length;
    const previousLabelsCount = labelsCount - 1;

    let lastOverlappedIdx;

    if (labelsCount === 0) return;

    for (
      let lastVisibleLabelIdx = 0;
      lastVisibleLabelIdx < previousLabelsCount;

    ) {
      for (
        lastOverlappedIdx = lastVisibleLabelIdx + 1;
        lastOverlappedIdx < labelsCount;
        lastOverlappedIdx++
      ) {
        if (
          !elementsCollide(
            rowLabels[lastVisibleLabelIdx],
            rowLabels[lastOverlappedIdx]
          )
        ) {
          rowLabels[lastOverlappedIdx].classList.remove('hide');
          break;
        }

        rowLabels[lastOverlappedIdx].classList.add('hide');
      }
      lastVisibleLabelIdx = lastOverlappedIdx;
    }
  };

  debouncedProcessLabels = debounce(this.processPairingNameLabels, 350);

  rowsCountStored = [];
  needRender = idx => {
    if (!this.props.isZoomed) {
      return true;
    }

    const noOfRowsTop = Math.abs(Math.floor(this.props.scrollTop / ROW_HEIGHT));
    const noOfRowsNeeded = Math.abs(Math.ceil(window.innerHeight / ROW_HEIGHT));

    // To handle the scenario where rowCount will be dynamic ie more than 1
    let rowCount = 0;
    for (let i = 1; i < this.rowsCountStored.length; i++) {
      rowCount += this.rowsCountStored[i];
    }

    const index = rowCount + idx;

    return index > noOfRowsTop - 5 && index < noOfRowsTop + noOfRowsNeeded;
  };

  generatePairingRows = () => {
    const {
      t,
      index,
      pairings,
      flights,
      timelineWindowHeight,
      isZoomed,
    } = this.props;
    let totalPairingsGroups = 0;
    let pairingGroups = [];
    let objectsToRender = [];
    this.rowsCountStored = [];

    if (index === 0) {
      // Show pairings in Timeline Window 1
      objectsToRender = pairings;
      totalPairingsGroups = pairings.length;
    } else if (index === 1) {
      // Show pairings in Timeline Window 2
      objectsToRender = flights;
      totalPairingsGroups = flights.length;
    }

    const extraRowsToFill = MIN_ROWS_NUMBER - totalPairingsGroups;
    const extraRowsAreNeeded = extraRowsToFill > 0;

    pairingGroups = objectsToRender.map((pairingGroup, rowIndex) => {
      const rowCount = pairingGroup.rowCount || 1;
      this.rowsCountStored.push(rowCount);
      const grouppedPairings = pairingGroup._grouppedPairings || [];
      return (
        <div
          key={`pairing-group-${rowIndex}`}
          className="pt-hl"
          style={{ height: ROW_HEIGHT * rowCount }}
        >
          {/* <span style={{ margin: 10, display: 'block', position: 'absolute' }}>
            {rowIndex}
          </span> */}
          {grouppedPairings.map((pairings, idx) => {
            const render = this.needRender(idx);
            return (
              <div
                key={`pairing-row-${idx}`}
                className="pairings-row"
                style={{ height: ROW_HEIGHT }}
              >
                {pairings.map((pairing, idx) => {
                  const { type, id } = pairing;
                  const pairingPosition = `${index}-${rowIndex}-${idx}`; // timeline, row, position
                  const uniqueId = `${type}.${pairingPosition}.${id}`;

                  if (render) {
                    return (
                      <PairingObject
                        t={t}
                        key={`pairing-${idx}-${id}`}
                        pairing={pairing}
                        uniqueId={uniqueId}
                        timelineWindowHeight={timelineWindowHeight}
                        index={index}
                        isZoomed={isZoomed}
                      />
                    );
                  }

                  return false;
                })}
              </div>
            );
          })}
        </div>
      );
    });

    if (extraRowsAreNeeded) {
      for (let i = 0; i < extraRowsToFill; i++) {
        pairingGroups.push(
          <div
            key={`empty-group-${i}`}
            className="pt-hl"
            style={{ height: ROW_HEIGHT }}
          />
        );
      }
    }

    return pairingGroups;
  };

  handleOnClick = () => {
    this.props.clearSelectedPairing();
  };

  render() {
    return (
      <Fragment>
        <div
          ref={this.rowRef}
          className="pt-horizontal-lines"
          onClick={this.handleOnClick}
        >
          {this.generatePairingRows()}
        </div>
      </Fragment>
    );
  }
}

TimelineRows.propTypes = {
  t: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  pairings: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  clearSelectedPairing: PropTypes.func.isRequired,
  columnWidthInPx: PropTypes.number.isRequired,
  flights: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  scrollTop: PropTypes.number.isRequired,
  isZoomed: PropTypes.bool.isRequired,
};

export default props => (
  <TimelineContext.Consumer>
    {({ pairings, flights, clearSelectedPairing }) => (
      <TimelineRows
        {...props}
        pairings={pairings}
        flights={flights}
        clearSelectedPairing={clearSelectedPairing}
      />
    )}
  </TimelineContext.Consumer>
);
