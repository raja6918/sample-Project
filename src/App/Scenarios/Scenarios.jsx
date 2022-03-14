import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Drawer from '@material-ui/core/Drawer';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './Scenarios.scss';
import scopes from '../../constants/scopes';

import { isToday, isThisMonth, sumDays } from '../../utils/dates';
import {
  redirectToDataHome,
  findScenarioIndexAndLocation,
  handleOpenItem,
} from './helpers';

import Loading from '../../components/Loading';
import ContainerCUI from '../../components/Container';
import ScenariosTable from './ScenarioTable';
import ScenariosHeader from './TableHeader';
import DeleteDialog from '../../components/Dialog/DeleteDialog';
import Confirmation from '../../components/Dialog/Confirmation';
import DataNotFoundMessage from '../../components/DataNotFound';
import ScenarioForm from './ScenarioForm';
import TemplatesGallery from '../../components/Templates/TemplatesGallery';

import Notification from '../../components/Notification';
import ModalLoader from '../../components/ModalLoader';

import ScenarioInfo from './ScenarioInfo';
import GetTemplateInfoForm from './GetTemplateInfoForm';

import storage from '../../utils/storage';
import SaveAsTemplateForm from './SaveAsTemplateForm';

import scenariosService from '../../services/Scenarios';
import templatesService from '../../services/Templates';
import withErrorHandler from './../../components/ErrorHandler/withErrorHandler';

import { EDIT } from './constants';
import { checkPermission, perfectScrollConfig, Sort } from '../../utils/common';
import {
  PushScenarioDataToAnalytics,
  pushTemplateDataToAnalytics,
} from '../../utils/analytics';
import { connect } from 'react-redux';

const Fetching = styled.div`
  position: relative;
  top: 152px;
`;

const Container = styled(ContainerCUI)`
  & .scenario-table:last-child {
    padding-bottom: 40px !important;
  }
`;

class Scenarios extends Component {
  state = {
    scenariosToday: [],
    scenariosThisMonth: [],
    scenariosOlder: [],
    isFetching: false,
    deleteDialogIsOpen: false,
    saveAsTemplateIsOpen: false,
    isScenariosEmpty: false,
    isScenariosMounting: true,
    scenarioFormIsOpen: false,
    getTemplateInfoFormIsOpen: false,
    selectedTemplate: {},
    showTemplates: false,
    showScenarioInfo: false,
    showViewOnlyConfirmation: false,
    showViewOnlyConfirmationTemplate: false,
    currentScenario: {},
    openLoader: false,
    titleLoader: '',
    subtitleLoader: '',
    snackBarMessage: null,
    templates: [],
  };
  stickyHeader = null;
  nodeStickyHeader = null;
  nodeToday = null;
  nodeThisMonth = null;
  nodeOlder = null;
  stickyToday = null;
  stickyThisMonth = null;
  stickyOlder = null;
  cardMenuActions = [];

  createdByFilter = 'ME';

  findScenarioIndexAndLocation = findScenarioIndexAndLocation.bind(this);

  toggleTemplates = () => {
    const { t, userPermissions } = this.props;
    if (
      checkPermission(scopes.scenario.templateViewOrManage, userPermissions)
    ) {
      this.setState(state => ({ showTemplates: !state.showTemplates }));
    } else {
      this.setState({
        snackBarMessage: t('ERRORS.SCENARIOS.templatePermission'),
        snackBarType: 'error',
      });
    }
  };

  openDeleteDialog = (scenario, list, index) => {
    this.setState({
      deleteDialogIsOpen: true,
      scenarioToDelete: scenario,
      scenariosToFilter: list,
      scenarioIndex: index,
    });
  };

  closeForm = name => {
    this.setState({
      [name]: false,
    });
  };

  isScenariosEmpty = () => {
    const { scenariosToday, scenariosThisMonth, scenariosOlder } = this.state;
    const isScenariosEmpty =
      scenariosToday.length === 0 &&
      scenariosThisMonth.length === 0 &&
      scenariosOlder.length === 0;
    if (isScenariosEmpty) {
      this.setState({
        isScenariosEmpty: isScenariosEmpty,
      });
    }
  };

  deleteScenario = () => {
    const { scenarioToDelete } = this.state;
    const scenarios = this.state.scenariosToFilter;
    const index = this.state.scenarioIndex;

    scenariosService
      .deleteScenario(scenarioToDelete.id)
      .then(() => {
        if (scenarioToDelete !== undefined) {
          PushScenarioDataToAnalytics(scenarioToDelete, 'Delete');
        }
        this.setState(
          prevState => {
            return prevState[scenarios].length === 0
              ? {
                  [scenarios]: [],
                }
              : {
                  [scenarios]: [
                    ...prevState[scenarios].slice(0, index),
                    ...prevState[scenarios].slice(index + 1),
                  ],
                  snackBarMessage: this.props.t('SUCCESS.SCENARIOS.REMOVE', {
                    scenario: scenarioToDelete.name,
                  }),
                  showScenarioInfo: false,
                  snackBarType: 'success',
                };
          },
          () => {
            this.closeForm('deleteDialogIsOpen');
            this.isScenariosEmpty();
          }
        );
      })
      .catch(error => {
        const { name } = scenarioToDelete;
        const customMessageArguments = [name];
        this.setState(
          {
            deleteDialogIsOpen: false,
          },
          this.props.reportError({ error, customMessageArguments })
        );
      });
  };

  filterScenarios = scenarios => {
    if (scenarios.length > 0) {
      const scenariosToday = [];
      const scenariosThisMonth = [];
      const scenariosOlder = [];

      scenarios.forEach(scenario => {
        if (isToday(scenario.lastOpenedByMe)) {
          scenariosToday.push(scenario);
        } else if (
          isThisMonth(scenario.lastOpenedByMe) &&
          !isToday(scenario.lastOpenedByMe)
        ) {
          scenariosThisMonth.push(scenario);
        } else {
          scenariosOlder.push(scenario);
        }
      });

      this.setState({
        scenariosToday: scenariosToday,
        scenariosThisMonth: scenariosThisMonth,
        scenariosOlder: scenariosOlder,
        isScenariosEmpty: false,
        isScenariosMounting: false,
      });
    } else {
      this.setState({
        isScenariosEmpty: true,
        isScenariosMounting: false,
      });
    }
  };

  getScenarios = filter => {
    this.createdByFilter = filter;

    scenariosService
      .getScenarios(filter)
      .then(scenarios => {
        const locallyOpenedScenario = storage.getItem('openScenario');

        /* Store the opened scenario in the response in session storage */
        if (!locallyOpenedScenario) {
          const openedScenarioIdx = scenarios.findIndex(
            scenario => scenario.status === EDIT
          );

          if (openedScenarioIdx >= 0) {
            storage.setItem('openScenario', scenarios[openedScenarioIdx]);
          }
        }

        this.filterScenarios(scenarios);
      })
      .catch(error => {
        this.props.reportError({ error });
      });
  };

  handleCreatedBy = filter => {
    this.getScenarios(filter);
  };

  // handleEditTemplate = template => {
  //   const editMode = true;
  //   redirectToDataHome(template.id, template.name, editMode);
  // };

  componentDidMount() {
    const { userPermissions } = this.props;
    this.getScenarios(this.createdByFilter);
    if (
      checkPermission(scopes.scenario.templateViewOrManage, userPermissions)
    ) {
      templatesService
        .getTemplates()
        .then(templates => {
          Sort(templates, 'name');
          this.setState({ templates });
        })
        .catch(error => {
          this.props.reportError({ error });
        });
    }
  }

  componentWillMount() {
    const { t } = this.props;
    const menu = 'GLOBAL.menu';

    /* Configure the menu items for each card in Scenarios page */
    this.cardMenuActions = [
      {
        handleClick: this.handleEditTemplate,
        icon: 'open_in_browser',
        text: t(`${menu}.open`),
        closesMenu: false,
      },
      {
        handleClick: this.handleGetTemplateInfo,
        icon: 'info',
        text: t(`${menu}.getInfo`),
        closesMenu: true,
      },
    ];
  }

  componentWillUnmount() {
    if (this._scrollRefY) {
      this._scrollRefY.removeEventListener('ps-scroll-y', this.handleScroll);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const tableHead = 'SCENARIOS.tableHead';

    if (nextState.scenariosToday.length > 0) {
      this.stickyHeader = nextProps.t(`${tableHead}.today`);
    } else {
      if (nextState.scenariosThisMonth.length > 0) {
        this.stickyHeader = nextProps.t(`${tableHead}.month`);
      } else if (nextState.scenariosOlder.length > 0) {
        this.stickyHeader = nextProps.t(`${tableHead}.older`);
      } else {
        this.stickyHeader = '';
      }
    }
  }

  componentDidUpdate() {
    if (this._scrollRefY) {
      this._scrollRefY.addEventListener('ps-scroll-y', this.handleScroll);
    }
    this.nodeToday = document.getElementById('tableToday');
    this.stickyToday = this.nodeToday ? this.nodeToday.offsetTop : null;
    this.nodeThisMonth = document.getElementById('tableThisMonth');
    this.stickyThisMonth = this.nodeThisMonth
      ? this.nodeThisMonth.offsetTop
      : null;
    this.nodeOlder = document.getElementById('tableOlder');
    this.stickyOlder = this.nodeOlder ? this.nodeOlder.offsetTop : null;
    this.nodeStickyHeader = document.getElementById('stickyHeader');
  }

  stopLoading = () => {
    this.setState({
      isFetching: false,
    });
  };

  handleScroll = () => {
    if (this.nodeStickyHeader === null) return;

    this.setStickyHeader();
  };

  setStickyHeader() {
    let pageOffset = 0;
    if (this._scrollRefY) pageOffset = this._scrollRefY.scrollTop;
    const initialStickyHeader = 130;
    if (pageOffset + this.stickyToday >= this.stickyToday) {
      this.nodeStickyHeader.innerHTML = this.stickyHeader;
    }
    if (
      this.stickyThisMonth &&
      pageOffset + initialStickyHeader >= this.stickyThisMonth
    ) {
      const h3node = this.nodeThisMonth.querySelector('h3');
      this.nodeStickyHeader.innerHTML = h3node
        ? h3node.textContent
        : this.stickyHeader;
    }
    if (
      this.stickyOlder &&
      pageOffset + initialStickyHeader >= this.stickyOlder
    ) {
      const h3node = this.nodeOlder.querySelector('h3');
      this.nodeStickyHeader.innerHTML = h3node
        ? h3node.textContent
        : this.stickyHeader;
    }
  }
  /*Create new Scenario*/

  openScenarioForm = template => {
    this.setState({
      scenarioFormIsOpen: true,
      templateSelected: template.id,
      templateSelectedName: template.name,
    });
  };

  handleSaveAsTemplateForm = form => {
    const templateName = form.templateName.value.trim();
    if (form.checkValidity()) {
      const dataToSave = {
        sourceId: this.state.sourceId,
        name: templateName,
        category: form.category[0] ? form.category[0].value : '',
        description: form.description.value || '',
        isTemplate: true,
      };

      this.setState({
        openLoader: true,
        titleLoader: this.props.t('SCENARIOS.form.asTemplate.loader'),
        subtitleLoader: this.state.scenarioName,
      });

      templatesService
        .createTemplate(dataToSave)
        .then(template => {
          if (Array.isArray(template)) {
            pushTemplateDataToAnalytics(template[0], 'Create', 'Scenario');
          }
          this.setState({
            openLoader: false,
            snackBarMessage: this.props.t('SCENARIOS.form.asTemplate.success', {
              templateName: templateName,
            }),
            saveAsTemplateIsOpen: false,
            snackBarType: 'success',
          });

          templatesService
            .getTemplates()
            .then(templates => {
              templates.sort((a, b) => a.name > b.name);
              this.setState({ templates });
            })
            .catch(error => {
              this.props.reportError({ error });
            });
        })
        .catch(error => {
          this.setState(
            {
              openLoader: false,
              saveAsTemplateIsOpen: false,
            },
            this.props.reportError({ error })
          );
        });
    }
  };

  handleScenarioForm = form => {
    if (form.checkValidity()) {
      let startDate = form.startDate.value;
      startDate = startDate
        ? moment.utc(form.startDate.value, 'YYYY/MM/DD').toISOString()
        : null;

      const endDate = sumDays(startDate, form.scenarioDuration.value.trim());

      const scenario = {
        name: form.scenarioName.value.trim(),
        startDate,
        endDate,
        sourceId: this.state.templateSelected,
        isTemplate: false,
      };

      this.setState({
        openLoader: true,
        titleLoader: this.props.t('SCENARIOS.process.create'),
        subtitleLoader: scenario.name,
      });
      scenariosService
        .createScenario(scenario)
        .then(createdScenario => {
          if (Array.isArray(createdScenario)) {
            PushScenarioDataToAnalytics(createdScenario[0], 'Create');
          }
          this.handleOpenScenario(createdScenario[0]);
        })
        .catch(error => {
          this.setState(
            { openLoader: false },
            this.props.reportError({ error })
          );
        });
    }
  };

  openSaveAsTemplate = scenario => {
    this.setState({
      saveAsTemplateIsOpen: true,
      scenarioName: scenario.name,
      sourceId: parseInt(scenario.id, 10),
    });
  };

  handleOpenScenario = async scenario => {
    const { userPermissions } = this.props;
    let hasManagePermission = false;
    storage.removeItem(`openTimeLineWindows`);
    storage.removeItem(`timelineFilter1`);
    storage.removeItem(`timelineFilter2`);
    storage.removeItem(`timelineFilter3`);
    storage.removeItem(`timelineLastFilter1`);
    storage.removeItem(`timelineLastFilter2`);
    storage.removeItem(`timelineLastFilter3`);
    storage.removeItem(`pairingStore`);
    storage.removeItem(`rulesetId`);
    if (checkPermission(scopes.scenario.manage, userPermissions)) {
      hasManagePermission = true;
    }
    handleOpenItem.call(
      this,
      scenario,
      this.handleOpenViewOnly,
      hasManagePermission
    );
  };

  handleGetInfo = scenario => {
    scenariosService
      .getScenarioDetails(scenario.id)
      .then(scenario => {
        this.setState({ showScenarioInfo: true, currentScenario: scenario });
      })
      .catch(error => {
        this.props.reportError({ error });
      });
  };

  handleOpenViewOnly = scenario => {
    const [index, arrayName] = this.findScenarioIndexAndLocation(scenario.id);
    const updatedScenarios = [...this.state[arrayName]];
    updatedScenarios[index] = scenario;

    this.setState({
      showViewOnlyConfirmation: true,
      openLoader: false,
      currentScenario: scenario,
      [arrayName]: updatedScenarios,
    });
  };

  handleOpenViewOnlyCancelBtn = () => {
    this.setState({ showViewOnlyConfirmation: false });
  };

  handleOpenViewOnlyOkBtn = () => {
    const { id, name } = this.state.currentScenario;
    storage.setItem('openScenario', this.state.currentScenario);

    this.setState({ openLoader: true, showViewOnlyConfirmation: false }, () => {
      this.props.setReadOnly(true);
      redirectToDataHome(id, name, false, true);
    });
  };

  updateScenarioInfo = scenarioData => {
    const name = scenarioData.name.value;
    const description = scenarioData.description.value;
    const dataToUpdate = {
      ...this.state.currentScenario,
      name,
      description,
    };

    scenariosService.updateScenario(dataToUpdate).then(updatedScenarios => {
      const openScenario = storage.getItem('openScenario');
      if (Array.isArray(updatedScenarios) && updatedScenarios.length) {
        if (openScenario && updatedScenarios[0].id === openScenario.id) {
          storage.setItem('openScenario', updatedScenarios[0]);
        }
        PushScenarioDataToAnalytics(updatedScenarios[0], 'Update');
      }
      const scenarioName = updatedScenarios[0].name;
      const newState = {
        snackBarMessage: this.props.t('SUCCESS.SCENARIOS.EDIT', {
          scenario: scenarioName,
        }),
        showScenarioInfo: false,
        snackBarType: 'success',
      };
      const scenariosArrays = [
        'scenariosOlder',
        'scenariosToday',
        'scenariosThisMonth',
      ];

      // Find for the edited scenario in one of the scenarios arrays and replace it with the updated one
      for (let i = 0; i < scenariosArrays.length; i++) {
        const scenarioArray = scenariosArrays[i];
        const scenarioIndex = this.state[scenarioArray].findIndex(
          scenario => scenario.id === updatedScenarios[0].id
        );
        if (scenarioIndex >= 0) {
          const scenariosRefresh = this.state[scenarioArray].slice(); // Clones array
          scenariosRefresh[scenarioIndex] = updatedScenarios[0];
          newState[scenarioArray] = scenariosRefresh;
          break;
        }
      }

      this.setState(newState);
    });
  };

  onClearSnackBar = () => {
    this.setState({
      snackBarMessage: '',
      snackBarType: '',
    });
  };

  handleGetTemplateInfo = template => {
    scenariosService
      .getScenarioDetails(template.id)
      .then(template => {
        this.setState({
          selectedTemplate: template,
          getTemplateInfoFormIsOpen: true,
        });
      })
      .catch(error => {
        this.props.reportError({ error });
      });
  };

  handleEditTemplate = async template => {
    const { userPermissions } = this.props;
    let hasManagePermission = false;
    if (checkPermission(scopes.template.manage, userPermissions)) {
      hasManagePermission = true;
    }
    handleOpenItem.call(
      this,
      template,
      this.openTemplateViewOnly,
      hasManagePermission
    );
  };

  openTemplateViewOnly = template => {
    this.setState({
      showViewOnlyConfirmationTemplate: true,
      selectedTemplate: template,
      openLoader: false,
    });
  };

  handleOkConfirmationTemplate = () => {
    const { id, name } = this.state.selectedTemplate;
    this.setState({ showViewOnlyConfirmationTemplate: false }, () => {
      this.props.setReadOnly(true);
      redirectToDataHome(id, name, true, true);
    });
  };

  handleCancelConfirmationTemplate = () => {
    this.setState({ showViewOnlyConfirmationTemplate: false });
  };

  render() {
    const {
      scenariosToday,
      scenariosThisMonth,
      scenariosOlder,
      isFetching,
      scenarioToDelete,
      deleteDialogIsOpen,
      isScenariosEmpty,
      isScenariosMounting,
      showTemplates,
      scenarioFormIsOpen,
      templateSelectedName,
      templates,
      saveAsTemplateIsOpen,
      scenarioName,
      showViewOnlyConfirmation,
      snackBarMessage,
      snackBarType,
      getTemplateInfoFormIsOpen,
      selectedTemplate,
      showViewOnlyConfirmationTemplate,
      currentScenario,
    } = this.state;
    const { t, userPermissions } = this.props;
    const { stickyHeader } = this;
    const tableHead = 'SCENARIOS.tableHead';
    if (!isScenariosMounting) {
      return (
        <React.Fragment>
          <ScenarioInfo
            anchor={'right'}
            isOpen={this.state.showScenarioInfo}
            handleCancel={() => this.closeForm('showScenarioInfo')}
            handleOk={this.updateScenarioInfo}
            scenario={this.state.currentScenario}
            templates={templates}
            t={t}
            scopes={scopes.scenario}
          />
          <PerfectScrollbar
            option={perfectScrollConfig}
            containerRef={ref => {
              this._scrollRefY = ref;
            }}
          >
            <div
              style={
                isScenariosEmpty
                  ? {
                      height: '270px',
                      overflow: 'hidden',
                    }
                  : { height: 'calc(100vh - 55px)' }
              }
            >
              <Container margin={'0px auto'} id="main-container">
                <ScenariosHeader
                  t={t}
                  stickyHeader={isScenariosEmpty ? null : stickyHeader}
                  handleAdd={this.toggleTemplates}
                  handleCreatedBy={this.handleCreatedBy}
                  scopes={scopes.scenario}
                />
                {isScenariosEmpty && (
                  <DataNotFoundMessage
                    style={{ top: '152px' }}
                    text={t('GLOBAL.dataNotFound.message', {
                      data: t(
                        'GLOBAL.dataNotFound.dataScenarios'
                      ).toLowerCase(),
                    })}
                  />
                )}

                {!isScenariosEmpty && scenariosToday.length > 0 && (
                  <ScenariosTable
                    style={{
                      position: 'relative',
                      top: '152px',
                      width: '100%',
                      margin: '0 auto',
                      zIndex: 1,
                    }}
                    scenarios={scenariosToday}
                    scenariostofilter={'scenariosToday'}
                    id="tableToday"
                    t={t}
                    openDeleteDialog={this.openDeleteDialog}
                    openSaveAsTemplate={this.openSaveAsTemplate}
                    handleOpenScenario={this.handleOpenScenario}
                    handleGetInfo={this.handleGetInfo}
                    needHeader={stickyHeader !== t(`${tableHead}.today`)}
                    scenarioHeader={t(`${tableHead}.today`)}
                    scopes={scopes.scenario}
                  />
                )}
                {!isScenariosEmpty && scenariosThisMonth.length > 0 && (
                  <ScenariosTable
                    style={{
                      position: 'relative',
                      top: '152px',
                      width: '100%',
                      margin: '0 auto',
                      zIndex: 1,
                    }}
                    scenarios={scenariosThisMonth}
                    needHeader={stickyHeader !== t(`${tableHead}.month`)}
                    scenarioHeader={t(`${tableHead}.month`)}
                    scenariostofilter={'scenariosThisMonth'}
                    id="tableThisMonth"
                    handleOpenScenario={this.handleOpenScenario}
                    handleGetInfo={this.handleGetInfo}
                    openSaveAsTemplate={this.openSaveAsTemplate}
                    t={t}
                    openDeleteDialog={this.openDeleteDialog}
                    scopes={scopes.scenario}
                  />
                )}
                {!isScenariosEmpty && scenariosOlder.length > 0 && (
                  <ScenariosTable
                    style={{
                      position: 'relative',
                      top: '152px',
                      width: '100%',
                      margin: '0 auto',
                      zIndex: 1,
                    }}
                    scenarios={scenariosOlder}
                    needHeader={stickyHeader !== t(`${tableHead}.older`)}
                    scenarioHeader={t(`${tableHead}.older`)}
                    scenariostofilter={'scenariosOlder'}
                    id="tableOlder"
                    t={t}
                    openDeleteDialog={this.openDeleteDialog}
                    openSaveAsTemplate={this.openSaveAsTemplate}
                    handleOpenScenario={this.handleOpenScenario}
                    handleGetInfo={this.handleGetInfo}
                    scopes={scopes.scenario}
                  />
                )}

                {isFetching && (
                  <Fetching>
                    <Loading />
                  </Fetching>
                )}
                <DeleteDialog
                  open={deleteDialogIsOpen}
                  handleCancel={() => this.closeForm('deleteDialogIsOpen')}
                  handleOk={this.deleteScenario}
                  onExited={this.onExitedDialog}
                  title={t('DIALOG.DELETE_SCENARIO.title')}
                  bodyText={t('DIALOG.DELETE_SCENARIO.body', {
                    scenarioToDelete: scenarioToDelete
                      ? scenarioToDelete.name
                      : null,
                  })}
                  okText={t('GLOBAL.form.delete')}
                  strongText={scenarioToDelete ? scenarioToDelete.name : null}
                  t={t}
                  modalCommand={true}
                  onClose={() => this.closeForm('deleteDialogIsOpen')}
                />
                <Confirmation
                  open={showViewOnlyConfirmation}
                  title={t('SCENARIOS.viewOnly.title')}
                  handleCancel={this.handleOpenViewOnlyCancelBtn}
                  handleOk={this.handleOpenViewOnlyOkBtn}
                  okButton={t('SCENARIOS.viewOnly.okButton')}
                  modalCommand={true}
                  onClose={this.handleOpenViewOnlyCancelBtn}
                >
                  {checkPermission(scopes.scenario.manage, userPermissions) && (
                    <p
                      style={{
                        fontSize: '14px',
                        color: '#000000',
                        lineHeight: '18px',
                      }}
                    >
                      {t('SCENARIOS.viewOnly.line_1', {
                        scenarioName: currentScenario.name,
                      })}{' '}
                      <strong>{currentScenario.isOpenedBy}</strong>.
                    </p>
                  )}
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#000000',
                      lineHeight: '18px',
                    }}
                  >
                    {t('SCENARIOS.viewOnly.line_2')}
                  </p>
                </Confirmation>
                <SaveAsTemplateForm
                  open={saveAsTemplateIsOpen}
                  handleCancel={() => this.closeForm('saveAsTemplateIsOpen')}
                  handleOk={this.handleSaveAsTemplateForm}
                  formId={'saveAsTemplateForm'}
                  t={t}
                  onClose={() => this.closeForm('saveAsTemplateIsOpen')}
                  scenario={scenarioName}
                  okButton={t('GLOBAL.form.create')}
                  cancelButton={t('GLOBAL.form.cancel')}
                />
                <ScenarioForm
                  open={scenarioFormIsOpen}
                  handleCancel={() => this.closeForm('scenarioFormIsOpen')}
                  handleOk={this.handleScenarioForm}
                  formId={'scenarioForm'}
                  t={t}
                  onClose={() => this.closeForm('scenarioFormIsOpen')}
                  template={templateSelectedName}
                  okButton={t('GLOBAL.form.create')}
                  cancelButton={t('GLOBAL.form.cancel')}
                />
              </Container>
            </div>
          </PerfectScrollbar>

          <Drawer
            anchor="top"
            open={showTemplates}
            onClose={this.toggleTemplates}
          >
            <TemplatesGallery
              templates={templates}
              paddingTop={10}
              cardMenuActions={this.cardMenuActions}
              t={t}
              handleClose={this.toggleTemplates}
              handleClick={this.openScenarioForm}
              scopes={scopes.template}
            />
            <GetTemplateInfoForm
              template={selectedTemplate}
              isOpen={getTemplateInfoFormIsOpen}
              handleCancel={() => this.closeForm('getTemplateInfoFormIsOpen')}
              formId={'getInfoFormScenarios'}
              t={t}
              onClose={() => this.closeForm('getTemplateInfoFormIsOpen')}
            />
          </Drawer>
          <ModalLoader
            open={this.state.openLoader}
            title={this.state.titleLoader}
            subtitle={this.state.subtitleLoader}
            color="white"
          />
          {snackBarMessage && (
            <Notification
              message={snackBarMessage}
              clear={this.onClearSnackBar}
              type={snackBarType}
              autoHideDuration={snackBarType === 'error' ? 360000 : 5000}
            />
          )}
          <Confirmation
            open={showViewOnlyConfirmationTemplate}
            title={t('TEMPLATES.viewOnly.title')}
            handleCancel={this.handleCancelConfirmationTemplate}
            handleOk={this.handleOkConfirmationTemplate}
            okButton={t('TEMPLATES.viewOnly.okButton')}
          >
            {checkPermission(scopes.template.manage, userPermissions) && (
              <p>
                {t('TEMPLATES.viewOnly.line_1')}:{' '}
                <strong>{selectedTemplate.isOpenedBy}</strong>
              </p>
            )}

            <p>{t('TEMPLATES.viewOnly.line_2')}</p>
          </Confirmation>
        </React.Fragment>
      );
    } else return <Loading />;
  }
}

const mapStateToProps = state => {
  const { user } = state;
  return {
    userPermissions: user.permissions,
  };
};

Scenarios.propTypes = {
  t: PropTypes.func.isRequired,
  setReadOnly: PropTypes.func,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  reportError: PropTypes.func.isRequired,
};

Scenarios.defaultProps = {
  setReadOnly: () => {},
};

const ScenariosComponent = connect(mapStateToProps)(
  withErrorHandler(Scenarios)
);

export default ScenariosComponent;
