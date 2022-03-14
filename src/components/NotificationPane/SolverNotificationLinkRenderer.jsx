import React, { useState } from 'react';
import storage from '../../utils/storage';
import history from '../../history';
import ModalLoader from '../ModalLoader';
import scenarioService from '../../services/Scenarios';
import * as solverService from '../../services/Solver';
import { t } from 'i18next';
import styled, { css } from 'styled-components';
import Notification from '../Notification';
import { closeNotificationBar } from '../../actions/generic';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FREE, READ_ONLY, EDIT } from './constants';
import { refreshScenarioInStorage } from './helper';
import { shortenText } from '../../utils/common';
import Dialog from '../Dialog/Form';
import ReactMarkdown from 'react-markdown';

const StyledDialog = styled(Dialog)`
  .MuiButton-contained {
    width: 150px;
  }
  & .MuiDialogContent-root {
    margin-bottom: 85px;
    font-family: 'Roboto';
    font-size: 14px;
  }
  & .MuiDialogTitle-root .MuiTypography-root b {
    font-weight: 400;
  }
`;

export const SolverNotificationLinkRender = props => {
  const [openLoader, updateLoader] = useState(false);
  const [title, updateTitle] = useState(null);
  const [message, updateMessage] = useState('');
  const type = 'error';
  const [scenarioSolverToBeNavigated, setNavigateScenarioSolver] = useState({
    scenarioToNavigate: {},
    currentScenarioOpened: {},
    solverToSelect: {},
  });
  const [dialogOpen, OpenDialog] = useState(false);

  const redirectToSolver = (scenario, solverId, readOnly = false) => {
    const route = {
      pathname: `/solver/${scenario.id}`,
      state: {
        openItemId: scenario.id,
        openSolverId: solverId,
        openItemName: scenario.name,
        readOnly,
      },
    };
    history.push(route);
  };

  const openScenario = async (currentscenarioId, scenario, solverId) => {
    OpenDialog(false);
    const scenarioToBeOpened = scenario.id;
    try {
      storage.removeItem(`openTimeLineWindows`);
      storage.removeItem(`rulesetId`);
      updateLoader(true);
      updateTitle(t('SCENARIOS.process.open'));
      switch (scenario.status) {
        case FREE: {
          if (currentscenarioId)
            await scenarioService.closeScenario(currentscenarioId);
          await scenarioService.openScenario(scenarioToBeOpened);
          refreshScenarioInStorage(scenario);
          redirectToSolver(scenario, solverId);
          break;
        }
        case READ_ONLY:
          updateLoader(true);
          updateTitle(t('SCENARIOS.process.open'));
          storage.setItem('openScenario', scenario);
          redirectToSolver(scenario, solverId, true);
          break;
        case EDIT:
          updateLoader(true);
          updateTitle(t('SCENARIOS.process.open'));
          if (currentscenarioId)
            await scenarioService.closeScenario(currentscenarioId);
          refreshScenarioInStorage(scenario);
          redirectToSolver(scenario, solverId);
          break;
        default:
      }
      setTimeout(() => {
        updateLoader(false);
        props.closeNotificationBar(true);
      }, 5000);
    } catch (error) {
      updateLoader(false);
      updateMessage(t('ERRORS.SCENARIO_ID_NOT_EXIST', [scenarioToBeOpened]));
    }
  };

  const handleOk = () => {
    const {
      currentScenarioOpened,
      scenarioToNavigate,
      solverToSelect,
    } = scenarioSolverToBeNavigated;
    storage.removeItem('openScenario');
    openScenario(
      currentScenarioOpened.id,
      scenarioToNavigate,
      solverToSelect.id
    );
  };

  const handleCancel = () => {
    OpenDialog(false);
    setNavigateScenarioSolver({
      scenarioToNavigate: {},
      solverToSelect: {},
      currentScenarioOpened: {},
    });
  };

  const handleNavigate = async (e, props) => {
    let alreadyNotNavigated = true;
    const scenarioSolverArray = props.href.split('/');
    const currentScenario = storage.getItem('openScenario');
    const loggedInUser = props.userData;
    const scenarioToBeOpened = parseInt(
      scenarioSolverArray[scenarioSolverArray.length - 2],
      10
    );
    const solverToBeOpened = parseInt(
      scenarioSolverArray[scenarioSolverArray.length - 1],
      10
    );

    try {
      const [scenario, solver] = await Promise.all([
        scenarioService.getScenarioDetails(scenarioToBeOpened),
        solverService.getSolverRequestById(
          scenarioToBeOpened,
          loggedInUser.id,
          solverToBeOpened
        ),
      ]);
      if (!currentScenario) {
        //user is in no scenario
        storage.removeItem(`openTimeLineWindows`);
        storage.removeItem(`rulesetId`);
        updateLoader(true);
        updateTitle(t('SCENARIOS.process.open'));
        await scenarioService.openScenario(scenarioToBeOpened);
        switch (scenario.status) {
          case READ_ONLY: {
            storage.setItem('openScenario', scenario);
            redirectToSolver(scenario, solverToBeOpened, true);
            break;
          }
          case EDIT:
          case FREE: {
            storage.setItem('openScenario', scenario);
            redirectToSolver(scenario, solverToBeOpened);
            break;
          }
          default:
            redirectToSolver(scenario, solverToBeOpened);
        }
        updateLoader(false);
        props.closeNotificationBar(true);
        alreadyNotNavigated = false;
      }

      if (currentScenario && currentScenario.id === scenarioToBeOpened) {
        redirectToSolver(
          currentScenario,
          solverToBeOpened,
          currentScenario.status === READ_ONLY
        );
        props.closeNotificationBar(true);
        alreadyNotNavigated = false;
      }

      //different scenario
      if (alreadyNotNavigated) {
        setNavigateScenarioSolver({
          scenarioToNavigate: scenario,
          solverToSelect: solver,
          currentScenarioOpened: currentScenario,
        });
        OpenDialog(true);
      }
    } catch (err) {
      updateLoader(false);
      updateMessage(t('ERRORS.SCENARIO_ID_NOT_EXIST', [scenarioToBeOpened]));
    }
  };
  const handleClear = () => {
    updateMessage('');
  };

  return (
    <React.Fragment>
      <span
        onClick={e => {
          handleNavigate(e, props);
        }}
      >
        {props.children
          ? shortenText(props.children[0].props.value, 50)
          : t('NOTIFICATION.defaultSolverName')}
      </span>
      <ModalLoader open={openLoader} title={title} color="white" />
      <Notification message={message} type={type} clear={handleClear} />
      <StyledDialog
        open={dialogOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        title={t('NOTIFICATION.notificationpopup.title')}
        okButton={t('NOTIFICATION.notificationpopup.OKbutton')}
        className="notification_dialog"
        onClose={handleCancel}
        renderer={true}
      >
        <ReactMarkdown
          source={t('NOTIFICATION.notificationpopup.message', {
            solverRequestName: scenarioSolverToBeNavigated.solverToSelect.name,
            scenarioName: scenarioSolverToBeNavigated.scenarioToNavigate.name,
          })}
        />
      </StyledDialog>
    </React.Fragment>
  );
};
const mapStateToProps = state => {
  return { userData: state.user.userData };
};
const mapDispatchToProps = dispatch => {
  return {
    closeNotificationBar: bool => dispatch(closeNotificationBar(bool)),
  };
};

SolverNotificationLinkRender.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.object).isRequired,
  closeNotificationBar: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    userName: PropTypes.string,
  }),
};

SolverNotificationLinkRender.defaultProps = {
  userData: {},
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SolverNotificationLinkRender);
