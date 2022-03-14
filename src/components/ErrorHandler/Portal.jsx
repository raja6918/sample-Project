import React from 'react';
import ReactDOM from 'react-dom';

const notificationRoot = document.getElementById('notification-area');

class Portal extends React.Component {
  el = document.createElement('div');

  componentDidMount() {
    notificationRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    notificationRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

export default Portal;
