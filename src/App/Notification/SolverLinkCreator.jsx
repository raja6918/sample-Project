import React from 'react';
import { Link } from 'react-router-dom';
import storage from '../../utils/storage';
import PropTypes from 'prop-types';
import { closeNotificationBar } from '../../actions/generic';
import { connect } from 'react-redux';
import { READ_ONLY } from '../../constants';

export const SolverLinkCreator = props => {
  const path = props.href.split('/');
  const pathname = '/solver/' + Number(path[path.length - 2]);
  let readOnly = false;
  const openedScenario = storage.getItem('openScenario');
  if (openedScenario) {
    readOnly = openedScenario.status === READ_ONLY;
  }

  const state = {
    openSolverId: Number(path[path.length - 1]),
    openItemId: Number(path[path.length - 2]),
    openItemName: openedScenario ? openedScenario.name : '',
    readOnly,
  };
  const name = Array.isArray(props.children)
    ? props.children[0].props.value
    : 'solvername';
  const jsx = (
    <Link
      to={{ pathname, state }}
      style={{ textDecoration: 'none', color: '#0a75c2', fontSize: '13px' }}
      onClick={() => props.closeNavNotificationBar(true)}
    >
      {name}
    </Link>
  );
  return jsx;
};

SolverLinkCreator.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.object),
  closeNavNotificationBar: PropTypes.func.isRequired,
};
const mapStateToProps = state => {
  return state;
};
const mapDispatchToProps = dispatch => {
  return {
    closeNavNotificationBar: bool => dispatch(closeNotificationBar(bool)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SolverLinkCreator);
