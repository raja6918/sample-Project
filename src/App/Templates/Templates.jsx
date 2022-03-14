import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import TemplatesForm from './TemplatesForm';
import { uniqBy, compact } from 'lodash';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import TemplatesGallery from '../../components/Templates/TemplatesGallery';
import Loading from '../../components/Loading';
import ModalLoader from '../../components/ModalLoader';
import Notification from '../../components/Notification';
import DeleteDialog from '../../components/Dialog/DeleteDialog';
import Confirmation from '../../components/Dialog/Confirmation';
import withErrorHandler from './../../components/ErrorHandler/withErrorHandler';

import GetInfoForm from './GetInfoForm';

import templatesService from '../../services/Templates';
import { redirectToDataHome, handleOpenItem } from './../Scenarios/helpers';

import scenariosService from './../../services/Scenarios';
import GetEditIcon from '../../components/Icons/GetEditIcon';
import storage from '../../utils/storage';
import scopes from '../../constants/scopes';
import AccessEnabler from '../../components/AccessEnabler';
import { checkPermission, Sort } from '../../utils/common';
import { pushTemplateDataToAnalytics } from '../../utils/analytics';
import { connect } from 'react-redux';

const TemplatesHeader = styled.div`
  background-color: #ffffff;
  position: relative;
  padding: 27px 24px;
  & p {
    display: inline-block;
    margin: 0;
    font-size: 20px;
    margin: 0;
  }

  & button:last-of-type {
    position: absolute;
    right: 104px;
    top: 11px;
  }
  & button:first-of-type {
    margin: 0;
    position: absolute;
    right: 24px;
    top: 7px;
  }
`;

const StyledP = styled.p`
  font-size: '14px';
  color: '#000000';
  line-height: '18px';
`;

export class Templates extends Component {
  state = {
    templates: [],
    fetching: true,
    templateFormIsOpen: false,
    suggestions: [],
    categories: [],
    message: null,
    snackType: '',
    openLoader: false,
    titleLoader: '',
    subtitleLoader: '',
    deleteDialogIsOpen: false,
    getInfoFormIsOpen: false,
    selectedTemplate: {},
    showViewOnlyModeConfirmation: false,
  };

  cardMenuActions = [];

  componentWillMount() {
    const { t } = this.props;
    const menu = 'GLOBAL.menu';

    /* Configure the menu items for each card in Templates page */
    this.cardMenuActions = [
      {
        icon: 'open_in_browser',
        text: t(`${menu}.open`),
        handleClick: this.handleOpenTemplate,
        closesMenu: false,
      },
      {
        handleClick: this.handleGetInfo,
        icon: 'info',
        svgIcon: GetEditIcon,
        text: t(`${menu}.getOrEditInfo`),
        closesMenu: true,
      },
      // {
      //   handleClick: this.handleDuplicate,
      //   icon: 'layers',
      //   text: t(`${menu}.duplicate`),
      //   closesMenu: false,
      // },
      {
        handleClick: this.openDeleteDialog,
        icon: 'delete',
        text: t(`${menu}.delete`),
        closesMenu: true,
      },
    ];
  }

  componentDidMount() {
    Promise.all([
      templatesService.getTemplates(),
      templatesService.getCategories(),
    ])
      .then(([templates, categories]) => {
        Sort(templates, 'name');
        const suggestions = templates.map(suggestion => ({
          value: suggestion.id,
          label: suggestion.name,
        }));
        this.setState({
          templates,
          suggestions: Sort(suggestions, 'label'),
          categories: this.mapCategories(categories),
          fetching: false,
        });
      })
      .catch(error => {
        this.setState(
          {
            fetching: false,
          },
          this.props.reportError({ error })
        );
      });
  }

  mapCategories = categories => {
    const mappedCategories = categories.map(this.mapCategory);

    const uniqueCategories = this.getUniqOptions(mappedCategories);

    return Sort(uniqueCategories, 'label');
  };

  mapCategory = c => {
    if (!c) return null;
    return {
      value: c,
      label: c,
    };
  };

  getUniqOptions = options => {
    return uniqBy(compact(options), 'label');
  };

  /* Handle Form */
  handleOpenForm = () => {
    this.setState({
      templateFormIsOpen: true,
    });
  };

  closeTemplateForm = () => {
    this.setState({
      templateFormIsOpen: false,
    });
  };

  handleTemplateForm = form => {
    if (form.checkValidity()) {
      this.setState({
        openLoader: true,
        subtitleLoader: form.templateName.value.trim(),
        titleLoader: this.props.t('TEMPLATES.creating'),
      });
      const category = form.category[0]
        ? form.category[0].value.trim().substr(0, 50)
        : null;
      const template = {
        sourceId: form.sourceTemplate[0].value,
        name: form.templateName.value.trim(),
        category: category,
        isTemplate: true,
        description: form.description.value.trim().replace(/\n/g, '\\n'),
      };

      templatesService
        .createTemplate(template)
        .then(createdTemplates => {
          if (Array.isArray(createdTemplates)) {
            pushTemplateDataToAnalytics(createdTemplates[0]);
          }
          this.handleOpenTemplate(createdTemplates[0]);
        })
        .catch(error => {
          this.setState(
            {
              openLoader: false,
            },
            this.props.reportError({ error })
          );
        });
    }
  };
  openDeleteDialog = template => {
    this.setState({
      deleteDialogIsOpen: true,
      selectedTemplate: template,
    });
  };

  closeDeleteDialog = () => {
    this.setState({
      deleteDialogIsOpen: false,
    });
  };

  handleAcceptDelete = () => {
    this.deleteTemplate(this.state.selectedTemplate);
    this.closeDeleteDialog();
  };

  deleteTemplate = template => {
    templatesService
      .deleteTemplate(template.id)
      .then(async () => {
        pushTemplateDataToAnalytics(template, 'Delete');
        const categories = await templatesService.getCategories();

        this.setState({
          categories: this.mapCategories(categories),
          templates: this.state.templates.filter(
            current => current.id !== template.id
          ),
          suggestions: this.state.suggestions.filter(
            current => current.value !== template.id
          ),
          message: this.props.t(`SUCCESS.TEMPLATES.REMOVE`, {
            templateName: template.name,
          }),
          snackType: 'success',
        });
      })
      .catch(error => {
        const { name } = template;
        const customMessageArguments = [name];
        this.props.reportError({
          error,
          customMessageArguments,
          messageKeySuffix: 'TEMPLATE',
        });
      });
  };

  handleGetInfo = template => {
    scenariosService
      .getScenarioDetails(template.id)
      .then(template => {
        template.category = !!template.category ? template.category : '';
        this.setState({
          selectedTemplate: template,
          getInfoFormIsOpen: true,
        });
      })
      .catch(error => {
        this.props.reportError({ error });
      });
  };
  // handleDuplicate = () => {};

  toggleGetInfoForm = () => {
    if (this.state.getInfoFormIsOpen && this.state.selectedTemplate) {
      this.setState({
        getInfoFormIsOpen: !this.state.getInfoFormIsOpen,
        selectedTemplate: {},
      });
    } else {
      this.setState({
        getInfoFormIsOpen: !this.state.getInfoFormIsOpen,
      });
    }
  };
  saveTemplate = template => {
    const { selectedTemplate } = this.state;
    const newTemplates = this.state.templates;
    const newSuggestions = this.state.suggestions;

    template.id = selectedTemplate.id;
    template.isTemplate = selectedTemplate.isTemplate;

    return templatesService
      .updateTemplate(template)
      .then(async res => {
        const openScenario = storage.getItem('openScenario');
        if (Array.isArray(res) && res.length) {
          if (openScenario && res[0].id === openScenario.id) {
            storage.setItem('openScenario', res[0]);
          }
          pushTemplateDataToAnalytics(res[0], 'Update');
        }

        const categories = await templatesService.getCategories();

        res.forEach(r => {
          newTemplates.forEach((t, i) => {
            if (t.id === r.id) {
              newTemplates[i] = { ...r };
            }
          });

          newSuggestions.forEach((s, i) => {
            if (s.value === r.id) {
              newSuggestions[i].label = r.name;
            }
          });
        });
        this.setState({
          suggestions: Sort(newSuggestions, 'label'),
          categories: this.mapCategories(categories),
          templates: Sort(newTemplates, 'name'),
          message: this.props.t(`SUCCESS.TEMPLATES.EDIT`, {
            templateName: template.name,
          }),
          snackType: 'success',
        });
      })
      .catch(error => {
        this.props.reportError({ error });
        return Promise.reject(error);
      });
  };
  handleForm = form => {
    const template = {
      name: form.name.value.trim(),
      category: form.category.value.trim() || null,
      description: form.description.value.trim(),
    };
    this.saveTemplate(template).then(this.toggleGetInfoForm);
  };

  onClearSnackBar = () => {
    this.setState({
      message: null,
      snackBarType: '',
    });
  };

  handleOpenTemplate = async template => {
    let hasManagePermission = false;
    const { userPermissions } = this.props;
    if (checkPermission(scopes.template.manage, userPermissions))
      hasManagePermission = true;
    handleOpenItem.call(
      this,
      template,
      this.openTemplateViewOnly,
      hasManagePermission
    );
  };

  openTemplateViewOnly = template => {
    this.setState({
      showViewOnlyModeConfirmation: true,
      selectedTemplate: template,
      openLoader: false,
    });
  };

  handleOkConfirmation = () => {
    const { id, name } = this.state.selectedTemplate;
    this.setState({ showViewOnlyModeConfirmation: false }, () => {
      this.props.setReadOnly(true);
      storage.setItem('openScenario', this.state.selectedTemplate);
      redirectToDataHome(id, name, true, true);
    });
  };

  handleCancelConfirmation = () => {
    this.setState({ showViewOnlyModeConfirmation: false });
  };

  render() {
    const {
      templateFormIsOpen,
      suggestions,
      message,
      snackType,
      categories,
      fetching,
      templates,
      openLoader,
      subtitleLoader,
      deleteDialogIsOpen,
      selectedTemplate,
      getInfoFormIsOpen,
      titleLoader,
      showViewOnlyModeConfirmation,
    } = this.state;
    const { t, userPermissions } = this.props;
    const name = selectedTemplate ? selectedTemplate.name : '';
    const globalMsg = 'GLOBAL.form';
    const templateMsg = 'TEMPLATES.messages';

    return (
      <React.Fragment>
        <TemplatesHeader>
          <p>{t('TEMPLATES.title')}</p>
          <AccessEnabler
            scopes={scopes.template.add}
            disableComponent
            render={props => (
              <Fab
                color="secondary"
                aria-label="add"
                onClick={this.handleOpenForm}
                disabled={props.disableComponent}
                className="tm-templates__create-btn"
              >
                <AddIcon />
              </Fab>
            )}
          />

          {/* <IconButton>
            <Icon style={{ margin: 0, fontSize: '32px' }} iconcolor={'#0A75C2'}>
              filter_list
            </Icon>
          </IconButton> */}
        </TemplatesHeader>
        {fetching ? (
          <Loading />
        ) : (
          <React.Fragment>
            <TemplatesGallery
              templates={templates}
              t={t}
              drawer={false}
              handleClick={template => this.handleOpenTemplate(template)}
              cardMenuActions={this.cardMenuActions}
              scopes={scopes.template}
            />
            <GetInfoForm
              template={selectedTemplate}
              categorySuggestions={categories.map(c => c.label)}
              isOpen={getInfoFormIsOpen}
              handleCancel={this.toggleGetInfoForm}
              handleOk={this.handleForm}
              formId={'getInfoForm'}
              t={t}
              onClose={this.toggleGetInfoForm}
              scopes={scopes.template}
            />
          </React.Fragment>
        )}
        {suggestions.length && (
          <TemplatesForm
            open={templateFormIsOpen}
            handleCancel={this.closeTemplateForm}
            handleOk={this.handleTemplateForm}
            formId={'templateForm'}
            t={t}
            onClose={this.closeTemplateForm}
            okButton={t(`${globalMsg}.create`)}
            cancelButton={t(`${globalMsg}.cancel`)}
            templateSuggestions={suggestions}
            categories={categories}
          />
        )}
        <ModalLoader
          open={openLoader}
          title={titleLoader}
          subtitle={subtitleLoader}
          color="white"
        />
        <DeleteDialog
          open={deleteDialogIsOpen}
          handleCancel={this.closeDeleteDialog}
          handleOk={this.handleAcceptDelete}
          onExited={this.closeDeleteDialog}
          title={t(`${templateMsg}.deleteTitle`)}
          bodyText={name ? t(`${templateMsg}.deleteBody`, { name }) : ''}
          bodyText2={t(`${templateMsg}.deleteBody2`)}
          okText={t(`${globalMsg}.delete`)}
          strongText={null}
          t={t}
          modalCommand={true}
          onClose={this.closeDeleteDialog}
        />
        <Confirmation
          open={showViewOnlyModeConfirmation}
          title={t('TEMPLATES.viewOnly.title')}
          handleCancel={this.handleCancelConfirmation}
          handleOk={this.handleOkConfirmation}
          okButton={t('TEMPLATES.viewOnly.okButton')}
          modalCommand={true}
          onClose={this.handleCancelConfirmation}
        >
          {checkPermission(scopes.template.manage, userPermissions) && (
            <p
              style={{
                fontSize: '14px',
                color: '#000000',
                lineHeight: '18px',
              }}
            >
              {t('TEMPLATES.viewOnly.line_1', {
                templateName: selectedTemplate.name,
              })}{' '}
              <strong>{selectedTemplate.isOpenedBy}</strong>.
            </p>
          )}

          <p
            style={{
              fontSize: '14px',
              color: '#000000',
              lineHeight: '18px',
            }}
          >
            {t('TEMPLATES.viewOnly.line_2')}
          </p>
        </Confirmation>
        <Notification
          message={message}
          clear={this.onClearSnackBar}
          type={snackType}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state;
  return {
    userPermissions: user.permissions,
  };
};

Templates.propTypes = {
  t: PropTypes.func.isRequired,
  setReadOnly: PropTypes.func,
  reportError: PropTypes.func.isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

Templates.defaultProps = {
  setReadOnly: () => {},
};

const TemplatesComponent = connect(mapStateToProps)(
  withRouter(withErrorHandler(Templates, 3600000))
);

export default TemplatesComponent;
