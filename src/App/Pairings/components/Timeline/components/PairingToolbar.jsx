import React from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';
import { PairingToolbarItem } from './';
import { getToolbarItems } from './toolbarConfig';
import { getPriorityColor } from '../../OnlineValidation/helpers';

const SUBMENU_HEIGHT = 210;
const PX_TO_EDGE = 5;

class PairingToolbar extends React.Component {
  toolbarRef = React.createRef();

  state = {
    toolbarWidth: 0,
    bottom: true,
  };

  componentWillMount() {
    this.h = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
    this.w = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
  }

  componentDidMount() {
    /* Get the toolbar width on screen to center it with the pairing container */
    const { toolbarWidth } = this.state;
    const { timelineWindowHeight, index } = this.props;
    const toolbarRef = this.toolbarRef.current;
    const containerRect = document
      .getElementById(`pt-window-` + index)
      .getBoundingClientRect();
    const container_Y = containerRect.y || containerRect.top;
    const containerHeight = containerRect.height;

    if (!toolbarWidth && toolbarRef) {
      const { clientWidth, clientHeight } = toolbarRef;
      const currentY =
        toolbarRef.getBoundingClientRect().y ||
        toolbarRef.getBoundingClientRect().top;
      const bottomSpace =
        index === 0 && containerHeight + container_Y < currentY
          ? Math.ceil(containerHeight - currentY - clientHeight)
          : Math.ceil(this.h - currentY - clientHeight);
      const surpassBottom = bottomSpace < SUBMENU_HEIGHT;

      this.setState({
        toolbarWidth: clientWidth,
        bottom: !surpassBottom,
      });
    }
  }

  repositionPairingToolbar = () => {
    try {
      const { pairingObjectRef } = this.props;
      const pairingObjectRect = pairingObjectRef.current.getBoundingClientRect();
      const pairingStart_X = pairingObjectRect.x || pairingObjectRect.left;
      const { width: pairingWidth } = pairingObjectRect;
      const pairingEnd_X = pairingStart_X + pairingWidth;
      const pairingIsOutsideScreen =
        pairingEnd_X < 0 || pairingStart_X > this.w;

      if (pairingIsOutsideScreen) return;

      const toolbarRef = this.toolbarRef.current;
      const toolbarRect = toolbarRef.getBoundingClientRect();
      const toolbarStart_X = toolbarRect.x || toolbarRect.left;
      const { width } = toolbarRect;
      const toolbarEnd_X = toolbarStart_X + width;

      if (toolbarStart_X < 0) {
        const diff = Math.ceil(Math.abs(toolbarStart_X) + PX_TO_EDGE);
        const newLeft = toolbarRef.offsetLeft + diff;
        this.toolbarRef.current.style.left = `${newLeft}px`;
      } else if (toolbarEnd_X > this.w) {
        const diff = Math.ceil(toolbarEnd_X - this.w + PX_TO_EDGE);
        const newLeft = toolbarRef.offsetLeft - diff;
        this.toolbarRef.current.style.left = `${newLeft}px`;
      }
    } catch (error) {
      console.error(error);
    }
  };

  componentDidUpdate() {
    setTimeout(this.repositionPairingToolbar, 0);
  }

  render() {
    const toolbarItems = getToolbarItems(this.props);
    const {
      t,
      pairing,
      pairingObjectStyle,
      onAlertSelect,
      onAlertClear,
      openRuleEditDialog,
    } = this.props;
    const { toolbarWidth, bottom } = this.state;
    const { width } = pairingObjectStyle;
    const classNames = className({
      'pairing-toolbar': true,
      bottom: bottom,
      top: !bottom,
    });
    const borderColor = getPriorityColor(pairing.alerts);

    /*
      This is a fix for IE. On the first render of the toolbar,
      we position it completely outside of it container.
    */
    const style = { left: -100000 };

    if (toolbarWidth) {
      style.width = toolbarWidth;
      style.left = (width - toolbarWidth) / 2;
    }

    /* Stop the event propagation when any click is performed on the Toolbar */
    const stopPropagation = event => event.stopPropagation();

    return (
      <React.Fragment>
        <span
          className="pairing-select top"
          style={{ background: borderColor }}
        />
        <span
          className="pairing-select bottom"
          style={{ background: borderColor }}
        />
        <span
          className="pairing-select left"
          style={{ background: borderColor }}
        />
        <span
          className="pairing-select right"
          style={{ background: borderColor }}
        />
        {toolbarItems && (
          <span
            ref={this.toolbarRef}
            className={classNames}
            style={style}
            onClick={stopPropagation}
          >
            {toolbarItems.map((menuItem, idx) => (
              <PairingToolbarItem
                t={t}
                bottom={bottom}
                pairing={pairing}
                menuItem={menuItem}
                key={`menuitem-${idx}`}
                onAlertSelect={onAlertSelect}
                onAlertClear={onAlertClear}
                openRuleEditDialog={openRuleEditDialog}
              />
            ))}
          </span>
        )}
      </React.Fragment>
    );
  }
}

PairingToolbar.propTypes = {
  t: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  pairing: PropTypes.shape({}).isRequired,
  timelineWindowHeight: PropTypes.number.isRequired,
  pairingObjectStyle: PropTypes.shape({}).isRequired,
  pairingObjectRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
  onAlertSelect: PropTypes.func.isRequired,
  onAlertClear: PropTypes.func.isRequired,
  openRuleEditDialog: PropTypes.func.isRequired,
};

export default PairingToolbar;
