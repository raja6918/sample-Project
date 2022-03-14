import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Truncate from 'react-truncate';

class ReadMore extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      expanded: false,
      truncated: false,
    };

    this.handleTruncate = this.handleTruncate.bind(this);
    this.toggleLines = this.toggleLines.bind(this);
  }

  handleTruncate(truncated) {
    if (this.state.truncated !== truncated) {
      this.setState({
        truncated,
      });
    }
  }

  toggleLines(event) {
    event.preventDefault();

    this.setState({
      expanded: !this.state.expanded,
    });
  }

  render() {
    const { children, more, less, lines } = this.props;

    const { expanded, truncated } = this.state;

    return (
      <React.Fragment>
        <Truncate
          lines={!expanded && lines}
          ellipsis={
            <span className="clickable" onClick={this.toggleLines}>
              <i className="material-icons"> keyboard_arrow_down </i>
              <span>{more}</span>
            </span>
          }
          onTruncate={this.handleTruncate}
        >
          {children}
        </Truncate>
        {!truncated &&
          expanded && (
            <span className="clickable" onClick={this.toggleLines}>
              <i className="material-icons"> keyboard_arrow_up </i>
              {less}
            </span>
          )}
      </React.Fragment>
    );
  }
}

ReadMore.defaultProps = {
  lines: 3,
  more: 'See more',
  less: 'See less',
};

ReadMore.propTypes = {
  children: PropTypes.node.isRequired,
  lines: PropTypes.number,
  less: PropTypes.string,
  more: PropTypes.string,
};

export default ReadMore;
