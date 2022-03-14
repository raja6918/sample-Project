import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TooltipMUI from '@material-ui/core/Tooltip';

function getTooltipClasses(classes, type) {
  return classes && classes[type] ? classes[type] : '';
}
const TooltipCustom = styled(props => {
  return (
    <TooltipMUI
      {...props}
      classes={{
        ...(props.classes || {}),
        popper: `${props.className} ${getTooltipClasses(
          props.classes,
          'popper'
        )}`,
        tooltip: `tooltip ${getTooltipClasses(props.classes, 'tooltip')}`,
        tooltipPlacementLeft: `tooltip-placement-left ${getTooltipClasses(
          props.classes,
          'tooltipPlacementLeft'
        )}`,
        tooltipPlacementRight: `tooltip-placement-right ${getTooltipClasses(
          props.classes,
          'tooltipPlacementRight'
        )}`,
        tooltipPlacementTop: `tooltip-placement-top ${getTooltipClasses(
          props.classes,
          'tooltipPlacementTop'
        )}`,
        tooltipPlacementBottom: `tooltip-placement-bottom ${getTooltipClasses(
          props.classes,
          'tooltipPlacementBottom'
        )}`,
      }}
    />
  );
})`
  & .tooltip {
    font-size: 12px;
    color: #ffffff;
    background: #3d3d3d;
    border-radius: 6px;
  }

  & .tooltip > .arrow {
    position: absolute;
    font-size: 8px;
    width: 2em;
    height: 4em;
  }

  & .tooltip > .arrow::before {
    content: '';
    margin: auto;
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
  }

  & .tooltip-placement-left {
    margin: 0 8px;
  }

  & .tooltip-placement-right {
    margin: 0 8px;
  }

  & .tooltip-placement-top {
    margin: 8px 0;
  }

  & .tooltip-placement-bottom {
    margin: 8px 0;
  }

  & .tooltip-placement-bottom > .arrow {
    top: 0;
    left: 0;
    width: 3em;
    height: 1em;
    margin-top: -0.95em;
  }

  & .tooltip-placement-bottom > .arrow::before {
    border-width: 0 1em 1em 1em;
    border-color: transparent transparent #3d3d3d transparent;
  }

  & .tooltip-placement-top > .arrow {
    bottom: 0;
    left: 0;
    width: 3em;
    height: 1em;
    margin-bottom: -0.95em;
  }

  & .tooltip-placement-top > .arrow::before {
    border-width: 1em 1em 0 1em;
    border-color: #3d3d3d transparent transparent transparent;
  }

  & .tooltip-placement-right > .arrow {
    left: 0;
    width: 1em;
    height: 3em;
    margin-left: -0.95em;
  }

  & .tooltip-placement-right > .arrow::before {
    border-width: 1em 1em 1em 0;
    border-color: transparent #3d3d3d transparent transparent;
  }

  & .tooltip-placement-left > .arrow {
    right: 0;
    width: 1em;
    height: 3em;
    margin-right: -0.95em;
  }

  & .tooltip-placement-left > .arrow::before {
    border-width: 1em 0 1em 1em;
    border-color: transparent transparent transparent #3d3d3d;
  }
`;

class Tooltip extends Component {
  state = {
    arrowRef: null,
  };

  handleArrowRef = node => {
    this.setState({
      arrowRef: node,
    });
  };

  getPopperProps = () => ({
    popperOptions: {
      modifiers: {
        arrow: {
          enabled: Boolean(this.state.arrowRef),
          element: this.state.arrowRef,
        },
      },
    },
  });

  buildTitle = () => {
    if (!this.props.title) return '';

    return (
      <React.Fragment>
        {this.props.title}
        <span className="arrow" ref={this.handleArrowRef} />
      </React.Fragment>
    );
  };

  render() {
    const { title, ...otherProps } = this.props;

    return (
      <TooltipCustom
        {...otherProps}
        PopperProps={this.getPopperProps()}
        title={this.buildTitle()}
      >
        {this.props.children}
      </TooltipCustom>
    );
  }
}

Tooltip.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Tooltip;
