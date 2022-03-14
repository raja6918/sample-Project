import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';

const StyledPositionSeniority = styled.div`
  .label {
    display: block;
    color: rgba(0, 0, 0, 0.87);
    font-size: 12px;
    padding-bottom: 3px;
  }
  .draggable-list {
    border: 1px solid rgba(0, 0, 0, 0.14);
    background: #fff;
    margin-top: 10px;
    max-height: 400px;
    overflow-y: auto;
  }
`;

const StyledPositionItem = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.14);
  padding: 10px;
  height: 38px;
  font-size: 15px;
  z-index: 9999;
  background: ${props => (props.targetItem ? '#d8d8d8;' : '#fff')};
  cursor: ${props => (props.targetItem ? 'grab' : 'auto')};
  user-select: none;

  .text {
    flex-grow: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .position-info {
    white-space: nowrap;
    font-style: italic;
    font-size: 12px;
    color: #666;
  }

  &.dragging-helper-class {
    cursor: grabbing;
    box-shadow: 0 1px 5px 2px rgba(167, 167, 167, 0.5);

    .position-info {
      display: none;
    }
  }

  :last-child {
    border: none;
  }
`;

class PositionSeniority extends React.Component {
  listRef = React.createRef();
  scrollTop = null;

  componentWillUpdate() {
    if (this.listRef.current) {
      this.scrollTop = this.listRef.current.scrollTop;
    }
  }

  componentDidUpdate() {
    if (this.scrollTop && this.listRef.current) {
      this.listRef.current.scrollTop = this.scrollTop;
    }
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.props.sortItems(oldIndex, newIndex);
  };

  render() {
    const { positionType, positions, currentPosition, disabled } = this.props;

    const SortableContainer = sortableContainer(({ children }) => {
      return (
        <div className="draggable-list" ref={this.listRef}>
          {children}
        </div>
      );
    });

    const order = positions.findIndex(item => item.targetItem) + 1;
    const PositionItem = sortableElement(props => {
      let textLabel = '';
      if (props.firstItem || props.lastItem) {
        textLabel = props.firstItem ? 'most senior' : 'least senior';
      }
      return (
        <StyledPositionItem targetItem={props.targetItem}>
          <span className="text">{props.value}</span>
          {textLabel && <span className="position-info">({textLabel})</span>}
        </StyledPositionItem>
      );
    });

    return (
      <React.Fragment>
        {positionType && (
          <StyledPositionSeniority
            style={disabled ? { pointerEvents: 'none' } : {}}
          >
            <input type="hidden" name="order" id="order" value={order} />
            <span className="label">Seniority *</span>
            <span className="label">
              Drag and drop this position according to seniority
            </span>
            <SortableContainer
              lockAxis="y"
              helperClass="dragging-helper-class"
              lockToContainerEdges
              onSortEnd={this.onSortEnd}
            >
              {positions.map((position, index, source) => {
                let firstItem = false;
                let lastItem = false;
                if (source.length > 1) {
                  firstItem = index === 0;
                  lastItem = index === source.length - 1;
                }
                return (
                  <PositionItem
                    index={index}
                    disabled={!position.targetItem}
                    targetItem={position.targetItem}
                    key={`${position.id}-${position.code}`}
                    value={`${position.code} - ${position.name}`}
                    firstItem={firstItem}
                    lastItem={lastItem}
                  />
                );
              })}
            </SortableContainer>
          </StyledPositionSeniority>
        )}
      </React.Fragment>
    );
  }
}

PositionSeniority.propTypes = {
  sortItems: PropTypes.func.isRequired,
  positionType: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

PositionSeniority.defaultProps = {
  disabled: false,
};

export default PositionSeniority;
