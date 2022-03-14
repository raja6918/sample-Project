import React from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';

class Sticky extends React.Component {
  state = {
    top: 9999999,
  };

  ticking = false;

  handleEvent = () => {
    const { top } = this.elem.getBoundingClientRect();

    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.setState({ top });
        this.ticking = false;
      });

      this.ticking = true;
    }
  };

  componentDidMount() {
    if (this.props.throttle) {
      window.addEventListener('scroll', throttle(this.handleEvent, 200));
    } else {
      window.addEventListener('scroll', this.handleEvent);
    }
  }

  componentWillUnmount() {
    if (this.props.throttle) {
      window.removeEventListener('scroll', throttle(this.handleEvent, 200));
    } else {
      window.removeEventListener('scroll', this.handleEvent);
    }
  }

  render() {
    return (
      <div ref={elem => (this.elem = elem)}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

Sticky.propTypes = {
  render: PropTypes.func.isRequired,
  throttle: PropTypes.bool,
};

Sticky.defaultProps = {
  throttle: false,
};
export default Sticky;
