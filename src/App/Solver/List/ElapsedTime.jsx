import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

const TimeWrapper = styled.span`
  position: absolute;
  right: -35px;
`;

class ElapsedTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: this.props.defaultTime
        ? moment.duration(this.props.defaultTime).asSeconds()
        : 0,
      isRunning: false,
    };
  }

  interval = null;

  componentDidMount() {
    const { isRunning } = this.state;
    const { status } = this.props;
    if (status === 'Running' && !isRunning) {
      this.startClock();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { status, defaultTime } = nextProps;
    const timeInSeconds = moment.duration(defaultTime).asSeconds();
    const { isRunning, seconds } = this.state;
    if (status === 'Running' && !isRunning) {
      if (!this.interval) {
        if (timeInSeconds < seconds)
          this.setState({ seconds: timeInSeconds }, () => this.startClock());
        else this.startClock();
      }
    } else if (status !== 'Running' && isRunning) {
      this.stopClock();
    }
  }

  componentWillUnmount() {
    this.stopClock();
  }

  updateClock = () => {
    this.setState(prevState => ({
      seconds: prevState.seconds + 1,
      isRunning: true,
    }));
  };

  formattedClock = seconds => {
    const date = new Date(null);
    date.setSeconds(seconds);

    return date.toISOString().substr(11, 8);
  };

  stopClock = () => {
    if (this.state.isRunning) {
      window.clearInterval(this.interval);
      this.setState({
        isRunning: false,
      });
      this.interval = null;
    }
  };

  startClock = () => {
    if (!this.state.isRunning) {
      window.clearInterval(this.interval); // If there are any intervals already set, clear it and start new.
      this.interval = setInterval(() => {
        this.updateClock();
      }, 1000);
    }
  };

  render() {
    const { seconds } = this.state;
    return (
      <Fragment>
        <TimeWrapper>{this.formattedClock(seconds)}</TimeWrapper>
      </Fragment>
    );
  }
}

ElapsedTime.propTypes = {
  status: PropTypes.string.isRequired,
  defaultTime: PropTypes.string,
};

ElapsedTime.defaultProps = {
  defaultTime: '00:00:00',
};

export default ElapsedTime;
