import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Container from '../../../../components/DataContent/Container';
import Icon from '../../../../components/Icon';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuAction from '../../../../components/Menu/MenuAction';
import GetEditIcon from '../../../../components/Icons/GetEditIcon';
import RedirectLink from '../../../../components/RedirectLink';
import AddHeader from '../../../../components/Headers/AddHeader';
import EditModeBar from '../../../../components/EditModeBar';
import styled from 'styled-components';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import AssistantPhotoSvg from './RulesIcon/AssistantPhoto.svg';
import DragIndicatorSvg from './RulesIcon/DragIndicator.svg';
import * as ruleService from '../../../../services/Data/rules';
import storage from '../../../../utils/storage';
import './Rules.css';
import { Input, Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import { removeNode, changeNodeAtPath, addNodeUnderParent } from './utils';
import moment from 'moment';
import RuleSetInfo from './RuleSetInfo';
import DeleteDialog from '../../../../components/Dialog/DeleteDialog';
import withErrorHandler from '../../../../components/ErrorHandler/withErrorHandler';
import withDeleteHandler from '../../../../components/DeleteHandler/withDeleteHandler';
import Notification from '../../../../components/Notification';
import { ruleSetType } from './constants';
import history from './../../../../history';
import classNames from 'classnames';
import { checkPermission } from '../../../../utils/common';
import scopes from '../../../../constants/scopes';
import AccessEnabler from '../../../../components/AccessEnabler';
import {
  pushDataToAnalytics,
  pushRulesetDataToAnalytics,
} from '../../../../utils/analytics';
import { ellipsisTransformer } from '../../../../components/GenericTable/transformers';

const TreeDiv = styled.div`
  .rst__node:first-child
    .rst__nodeContent
    .rstcustom__rowWrapper
    .rstcustom__rowContents {
    background-color: #0a75c2;
    color: #fff;
    & .rstcustom__rowTitle {
      font-weight: unset;
    }
  }
  .rst__rowContents,
  .rst__moveHandle {
    -webkit-box-shadow: unset;
    -moz-box-shadow: unset;
    box-shadow: none;
    border-radius: 0px;
  }
  .rst__row {
    -webkit-box-shadow: 3px 6px 12px -5px rgba(117, 117, 117, 1);
    -moz-box-shadow: 3px 6px 12px -5px rgba(117, 117, 117, 1);
    box-shadow: 3px 6px 12px -5px rgba(117, 117, 117, 1);
  }
  .rst__node:first-child .rst__nodeContent .rst__rowWrapper * {
    background-color: #0a75c2;
    color: #fff;
  }
  .rst__lineFullVertical::after,
  .rst__lineHalfVerticalTop::after,
  .rst__lineHalfVerticalBottom::after,
  .rstcustom__lineChildren::after,
  .rst__lineChildren::after {
    background-color: #2d88c9;
    width: 3px;
  }
  .rst__lineHalfHorizontalRight::before {
    height: 3.8px;
    background-color: #2d88c9;
  }
  .rst__moveHandle,
  .rst__loadingHandle {
    border: none;
    background: #ffffff url(${DragIndicatorSvg}) no-repeat center;
  }
  .rst__rowContents {
    border: none;
  }
  .rst__rowWrapper:hover .rst__rowContents,
  .rst__rowWrapper:hover .rst__moveHandle {
    background-color: #e8f4fc;
  }
`;

export class RuleSet extends Component {
  gridSize = 10;
  inputRef = React.createRef();
  timer;
  timeOutTimer;
  editFieldTimer;

  constructor(props) {
    super(props);
    this.state = {
      addDuplicateApiCalled: false,
      calculatedHeight: window.innerHeight - 148,
      treeData: [],
      anchorEl: null,
      userId: this.props.userData.id,
      showRuleSetInfo: false,
      currentRuleSet: {},
      currentNode: null,
      deleteDialogIsOpen: false,
      selectedRuleset: null,
      type: ruleSetType,
      selectedNodePath: [],
      message: null,
      snackType: 'success',
      isUpdating: false,
    };
    this.initializeMenu();
  }
  apiCalled: false;
  cardMenuActions = [];

  initializeMenu() {
    const { t } = this.props;
    const menu = 'GLOBAL.menu';

    this.cardMenuActions = [
      {
        icon: 'open_in_browser',
        text: t(`${menu}.open`),
        handleClick: this.handleOpenNode,
        closesMenu: false,
      },
      {
        handleClick: this.handleGetEditInfo,
        icon: 'info',
        svgIcon: GetEditIcon,
        text: t(`${menu}.getOrEditInfo`),
        closesMenu: true,
      },
      {
        handleClick: this.addNewNode,
        icon: 'add',
        text: t(`${menu}.addChild`),
        closesMenu: true,
      },
      {
        handleClick: this.duplicateCurrentNode,
        icon: 'layers',
        text: t(`${menu}.duplicate`),
        closesMenu: false,
      },
      {
        handleClick: this.confirmRuleSetDelete,
        icon: 'delete',
        text: t(`${menu}.delete`),
        closesMenu: true,
      },
    ];
  }

  componentDidMount() {
    const { openItemId } = this.props;
    const { userId } = this.state;
    if (document.documentMode) {
      this.gridSize = 2;
    }
    window.addEventListener('resize', () => {
      const calculatedHeight = window.innerHeight - 148;
      this.setState({ calculatedHeight });
    });
    ruleService
      .getAllRuleSets(userId, openItemId)
      .then(ruleSets => {
        const r = ruleSets;
        const data = this.ruleSetConverter(r);
        this.setState({ treeData: [data] });
      })
      .catch(e => {
        console.log(e);
      });
  }

  componentDidUpdate() {
    const { t } = this.props;
    this.timeOutTimer = setTimeout(() => {
      const handles = document.querySelectorAll('.rst__moveHandle');
      for (let i = 0; i < handles.length; i++) {
        handles[i].setAttribute('title', t('DATA.ruleSets.nodeTitle'));
      }
    }, 1000);
  }
  createMenuActions = (node = {}, path) => {
    const { addDuplicateApiCalled, isUpdating } = this.state;
    const { readOnly, userPermissions } = this.props;
    return this.cardMenuActions.map((menuAction, index) => {
      const show =
        ['delete', 'layers'].includes(menuAction.icon) && node.fallback === 0;
      const isDisable =
        ['add', 'layers', 'delete'].includes(menuAction.icon) &&
        (addDuplicateApiCalled || readOnly || isUpdating);
      const ruleSetMngPerms = ['add', 'layers', 'delete'].includes(
        menuAction.icon
      );
      const isRuleSetMngDisable = ruleSetMngPerms
        ? !checkPermission(scopes.rules.rulesetManage, userPermissions)
        : false;

      return (
        !show && (
          <MenuAction
            disabled={isDisable || isRuleSetMngDisable}
            key={`menu-action-${index}`}
            handleClick={() => {
              this.handleMenuClick();
              if (menuAction.closesMenu) {
                this.closeMenu();
              }
              menuAction.handleClick(node, path);
            }}
            icon={menuAction.icon}
            svgIcon={menuAction.svgIcon}
            text={menuAction.text}
          />
        )
      );
    });
  };

  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.timeOutTimer);
    clearInterval(this.editFieldTimer);
  }

  ruleSetConverter = (rulesets = []) => {
    const idMapping = rulesets.reduce((acc, el, i) => {
      acc[el.id] = i;
      return acc;
    }, {});

    let root;
    rulesets.forEach(el => {
      el = this.addTitleSubtitleToNode(el);
      if (el.fallback === 0) {
        el.expanded = true;
        root = el;
        return;
      }
      const parentEl = rulesets[idMapping[el.fallback]];

      parentEl.children = [...(parentEl.children || []), el];
    });

    return root;
  };

  addNodeToTree = (newNode = {}, pathToattach) => {
    const { treeData } = this.state;
    return addNodeUnderParent({
      treeData,
      newNode,
      parentKey: pathToattach,
      getNodeKey: ({ treeIndex }) => treeIndex,
      expandParent: true,
    });
  };

  addTitleSubtitleToNode = (el = {}) => {
    const { t } = this.props;
    el.title = el.name ? el.name : '';
    if (el.lastModifiedDateTime)
      el.subtitle = t('DATA.ruleSets.lastModified', [
        moment(el.lastModifiedDateTime)
          .format('DD-MMM YYYY')
          .toUpperCase(),
      ]);
    return el;
  };

  updateNodeName = (e, ruleSet, path) => {
    e.target.disabled = true;
    const { treeData, selectedRuleset, userId } = this.state;
    const { openItemId } = this.props;
    const updatedRuleSetData = {
      fallback: ruleSet.fallback,
      id: ruleSet.id,
      name:
        e.target.value.trim() !== ''
          ? ruleSet.name.trim()
          : selectedRuleset.name,
    };
    ruleService
      .updateRuleSet(updatedRuleSetData, userId, openItemId)
      .then(updatedRuleSet => {
        if (Array.isArray(updatedRuleSet) && updatedRuleSet.length) {
          const formatedRuleSet = this.addTitleSubtitleToNode(
            updatedRuleSet[0]
          );
          const modifiedTreeData = changeNodeAtPath({
            treeData,
            path: path,
            newNode: formatedRuleSet,
            getNodeKey: ({ treeIndex }) => treeIndex,
          });
          this.setState({
            treeData: modifiedTreeData,
            selectedRuleset: null,
            isUpdating: false,
          });
        }
      })
      .catch(error => {
        const errorResponse = error.response.data;
        const formatedRuleSet = this.addTitleSubtitleToNode(selectedRuleset);
        const modifiedTreeData = changeNodeAtPath({
          treeData,
          path: path,
          newNode: formatedRuleSet,
          getNodeKey: ({ treeIndex }) => treeIndex,
        });
        let key = 'NAME_ERROR';

        if (errorResponse && errorResponse.messageKey) {
          key =
            errorResponse.messageKey === 'ENTITY_FIELD_DUPLICATE'
              ? errorResponse.messageKey
              : key;
        }
        this.setState({
          message: this.props.t(`ERRORS.RULESET.ADD.${key}`, {
            ruleSet: selectedRuleset.name,
          }),
          treeData: modifiedTreeData,
          selectedRuleset: null,
          snackType: 'error',
          isUpdating: false,
        });
      });
  };

  handleChangeNewNode(e, ruleSet, path) {
    const { treeData } = this.state;
    const formatedRuleSet = { ...ruleSet, name: e.target.value };
    const modifiedTreeData = changeNodeAtPath({
      treeData,
      path: path,
      newNode: formatedRuleSet,
      getNodeKey: ({ treeIndex }) => treeIndex,
    });
    this.setState({ treeData: modifiedTreeData });
  }

  generateNodeProps = ({ node, treeIndex, path }) => {
    const { anchorEl, isUpdating } = this.state;
    const imgClassNames = classNames({
      basicImg: true,
      displayImg: treeIndex !== 0,
    });
    return {
      title: (
        <Grid container spacing={2}>
          {node.newNode ? (
            <Grid item xs={this.gridSize} className="newRulecls">
              <Input
                inputRef={this.inputRef}
                className="ruleSetClass"
                placeholder={this.props.t('DATA.rules.textField.label')}
                inputProps={{
                  onBlur: e => this.updateNodeName(e, node, path),
                  maxLength: 50,
                  onKeyDown: e => {
                    if (e.keyCode === 13) this.updateNodeName(e, node, path);
                  },
                  onFocus: () => {
                    this.editFieldTimer = setTimeout(() => {
                      if (this.inputRef.current) {
                        this.inputRef.current.value = '';
                        this.inputRef.current.value = node.name;
                        this.inputRef.current.select();
                      }
                    }, 0);
                  },
                }}
                autoFocus={true}
                onChange={e => this.handleChangeNewNode(e, node, path)}
              />
            </Grid>
          ) : (
            <Grid item xs={6}>
              <img
                className={imgClassNames}
                src={AssistantPhotoSvg}
                alt={node.title}
              />
              <span className="basicTtlcls">
                {ellipsisTransformer(node.title, {}, { maxWidth: '280px' })}
              </span>
            </Grid>
          )}
        </Grid>
      ),
      subtitle: !node.newNode && node.subtitle !== '' && (
        <Grid container spacing={2} style={{ cursor: 'default' }}>
          <Grid item xs={2} />
          <Grid item xs={2} className="rootSubTitleCls">
            {node.subtitle}
          </Grid>
        </Grid>
      ),
      style: { width: '322px' },
      buttons: [
        <div>
          <IconButton
            aria-label="More"
            aria-owns={anchorEl ? 'long-menu' : null}
            aria-haspopup="true"
            onClick={e => this.openMenu(e, node.id)}
            disabled={isUpdating}
          >
            <Icon
              className="tree-icon"
              iconcolor={treeIndex === 0 ? '#fff' : '#0A75C2'}
              margin="0"
            >
              more_vert
            </Icon>
          </IconButton>

          <Menu
            className="more-option"
            id="long-menu"
            anchorEl={anchorEl}
            open={node.id === this.state.currentNode}
            onClose={this.closeMenu}
          >
            {this.createMenuActions(node, path)}
          </Menu>
        </div>,
      ],
    };
  };

  onClearSnackBar = () => {
    this.setState({
      message: null,
      snackBarType: '',
    });
  };

  confirmRuleSetDelete = (ruleSet, path) => {
    this.setState({
      deleteDialogIsOpen: true,
      selectedRuleset: ruleSet,
      selectedNodePath: path,
    });
  };

  deleteRuleSet = ruleSet => {
    if (ruleSet) {
      const { userId, type, selectedNodePath, treeData } = this.state;
      const { openItemId } = this.props;
      ruleService
        .deleteRuleset(ruleSet.id, openItemId, userId)
        .then(() => {
          const payload = {};
          payload['iRuleSetStatus'] = 'Delete';
          payload['iScenarioId'] = openItemId;
          payload['iRuleSetId'] = ruleSet.id;
          payload['iRuleSetParentId'] = ruleSet.fallback;
          pushRulesetDataToAnalytics(payload);
          pushDataToAnalytics(
            {
              type: 'Ruleset',
              scenarioId: openItemId,
            },
            'Delete'
          );
          const resultData = removeNode({
            treeData,
            path: selectedNodePath,
            getNodeKey: ({ treeIndex }) => treeIndex,
          });
          this.setState({
            treeData: resultData.treeData,
            message: this.props.t('SUCCESS.RULESET.REMOVE', {
              ruleSet: ruleSet.name,
            }),
            snackType: 'success',
            isUpdating: false,
          });
        })
        .catch(error => {
          this.props.handleDeleteError(error, type, ruleSet.name);
        });
    }
  };

  handleDelete = () => {
    const { selectedRuleset } = this.state;
    this.deleteRuleSet(selectedRuleset);
    this.closeDeleteDialog();
  };

  closeDeleteDialog = () => {
    this.setState({
      deleteDialogIsOpen: false,
      selectedRuleset: null,
      selectedNodePath: [],
      isUpdating: false,
    });
  };

  addNewNode = (ruleSet, path) => {
    if (!this.state.addDuplicateApiCalled)
      this.setState({ addDuplicateApiCalled: true }, () => {
        this.createNewRuleset(ruleSet, path, 'add');
      });
  };

  handleOpenNode = async ruleSet => {
    const { userId } = this.state;
    const { openItemId, openItemName, editMode, readOnly } = this.props;
    try {
      const checkRulesetExists = await ruleService.getRuleSetInfo(
        ruleSet.id,
        userId,
        openItemId
      );
      if (checkRulesetExists.id) {
        const route = {
          pathname: `/data/${openItemId}/rules`,
          state: {
            openItemId,
            openItemName,
            editMode,
            readOnly,
          },
        };
        storage.setItem('rulesetId', ruleSet.id);
        history.push(route);
      } else
        throw new Error({
          response: [{ errorDetails: [{ messageKey: 'NO_RESPONSE' }] }],
        });
    } catch (error) {
      const errorResponse = error.response
        ? error.response.data
        : [{ errorDetails: [{ messageKey: 'NO_RESPONSE' }] }];

      let key;
      if (Array.isArray(errorResponse) && errorResponse[0].errorDetails)
        key = errorResponse[0].errorDetails[0].messageKey;
      this.setState({
        showRuleSetInfo: false,
        currentRuleSet: {},
        selectedRuleset: null,
        selectedNodePath: [],
        message: this.props.t('ERRORS.RULESET.' + key, [
          'Ruleset',
          ruleSet.name,
        ]),
        snackType: 'error',
        anchorEl: null,
        currentNode: null,
      });
    }
  };

  handleGetEditInfo = (ruleSet, path) => {
    const { openItemId } = this.props;
    const { userId } = this.state;

    ruleService
      .getRuleSetInfo(ruleSet.id, userId, openItemId)
      .then(ruleSetData => {
        if (ruleSetData) {
          this.setState({
            showRuleSetInfo: true,
            currentRuleSet: ruleSetData,
            selectedRuleset: ruleSet,
            selectedNodePath: path,
            isUpdating: false,
          });
        }
      })
      .catch(error => {
        const errorResponse = error.response
          ? error.response.data
          : [{ errorDetails: [{ messageKey: 'NO_RESPONSE' }] }];

        let key;
        if (Array.isArray(errorResponse) && errorResponse[0].errorDetails)
          key = errorResponse[0].errorDetails[0].messageKey;
        this.setState({
          showRuleSetInfo: false,
          currentRuleSet: {},
          selectedRuleset: null,
          selectedNodePath: [],
          message: this.props.t('ERRORS.RULESET.' + key, [
            'Ruleset',
            ruleSet.name,
          ]),
          snackType: 'error',
          isUpdating: false,
        });
      });
  };

  createNewRuleset = (rSet, path, type = 'add') => {
    this.closeMenu();
    const { openItemId } = this.props;
    const { userId } = this.state;

    if (rSet) {
      const position = type === 'duplicate' ? 2 : 1;
      const ruleSet = {
        action: type,
        fallback: rSet.id,
      };

      ruleService
        .addRuleSet(ruleSet, userId, openItemId)
        .then(newRuleSet => {
          pushDataToAnalytics({
            type: 'Ruleset',
            scenarioId: openItemId,
          });
          if (newRuleSet.id) {
            const payload = {};
            payload['iRuleSetStatus'] = type === 'add' ? 'Add' : 'Duplicate';
            payload['iScenarioId'] = openItemId;
            payload['iRuleSetId'] = newRuleSet.id;
            payload['iRuleSetParentId'] = newRuleSet.fallback;
            pushRulesetDataToAnalytics(payload);

            const formatedRuleSet = { ...newRuleSet, newNode: true };
            const newTree = this.addNodeToTree(
              formatedRuleSet,
              path[path.length - position]
            );
            if (newTree.treeData)
              this.setState(
                {
                  treeData: newTree.treeData,
                  selectedRuleset: newRuleSet,
                  addDuplicateApiCalled: false,
                },
                () => {
                  // workaround since new nodes outside viewPort are not accessable
                  const e = document.querySelector(
                    '.rst__virtualScrollOverride'
                  );

                  let i = 500;
                  this.timer = setInterval(() => {
                    const maxScrollHeight = e.scrollHeight;
                    const maxClientHeight = e.clientHeight;
                    if (maxClientHeight + i < maxScrollHeight)
                      e.scroll(0, maxClientHeight + i);
                    else {
                      e.scroll(0, maxScrollHeight);
                      clearInterval(this.timer);
                    }
                    if (this.inputRef.current) {
                      this.inputRef.current.scrollIntoView({
                        block: 'center',
                      });
                    }
                    i += 100;
                  }, 100);
                }
              );
          }
        })
        .catch(error => {
          this.setState({
            message: this.props.t('ERRORS.RULESET.ADD.FAIL'),
            snackType: 'error',
            addDuplicateApiCalled: false,
            isUpdating: false,
          });
        });
    }
  };

  duplicateCurrentNode = (ruleSet, path) => {
    if (!this.state.addDuplicateApiCalled)
      this.setState({ addDuplicateApiCalled: true }, () => {
        this.createNewRuleset(ruleSet, path, 'duplicate');
      });
  };

  openMenu = (event, id) => {
    if (!event) return;
    this.setState({ anchorEl: event.currentTarget, currentNode: id });
  };

  closeMenu = () => {
    this.setState({ anchorEl: null, currentNode: null });
  };

  handleMenuClick = () => {
    this.setState({ isUpdating: true });
  };

  canDrag = ({ treeIndex }) => {
    if (treeIndex === 0) {
      return false;
    }
    return true;
  };

  canDrop = ({ treeIndex, nextTreeIndex, nextParent }) => {
    if (treeIndex === 0 || nextTreeIndex === 0 || !nextParent) {
      return false;
    }
    return true;
  };
  setRowHeight = () => {
    return 90;
  };
  onChangeTreeData = treeData => {
    this.setState({ treeData });
  };

  closeForm = name => {
    this.setState({
      [name]: false,
      selectedNodePath: [],
      currentRuleSet: {},
      selectedRuleset: null,
      showRuleSetInfo: false,
    });
  };

  updateRuleSetInfo = form => {
    const {
      currentRuleSet,
      selectedNodePath,
      treeData,
      selectedRuleset,
      userId,
    } = this.state;
    const { openItemId } = this.props;
    if (this.apiCalled) return;
    else this.apiCalled = true;
    if (currentRuleSet.id) {
      const updatedRuleSetData = {
        description: form.description.value.trim(),
        fallback: currentRuleSet.fallback,
        id: currentRuleSet.id,
        name: form.name.value.trim(),
      };
      ruleService
        .updateRuleSet(updatedRuleSetData, userId, openItemId)
        .then(updatedResponse => {
          pushDataToAnalytics(
            {
              type: 'Ruleset',
              scenarioId: this.props.openItemId,
            },
            'Update'
          );
          if (Array.isArray(updatedResponse) && updatedResponse[0]) {
            const formatedRuleSet = this.addTitleSubtitleToNode({
              ...selectedRuleset,
              ...updatedResponse[0],
            });

            const modifiedTreeData = changeNodeAtPath({
              treeData,
              path: selectedNodePath,
              newNode: formatedRuleSet,
              getNodeKey: ({ treeIndex }) => treeIndex,
            });
            this.setState(
              {
                treeData: modifiedTreeData,
                selectedNodePath: [],
                currentRuleSet: {},
                selectedRuleset: null,
                showRuleSetInfo: false,
                message: this.props.t('SUCCESS.RULESET.EDIT', {
                  ruleSet: formatedRuleSet.name,
                }),
                snackType: 'success',
              },
              () => {
                this.apiCalled = false;
              }
            );
          } else {
            this.setState({
              selectedNodePath: [],
              currentRuleSet: {},
              selectedRuleset: null,
              showRuleSetInfo: true,
              message: this.props.t('ERRORS.RULESET.editFail', {
                ruleSet: selectedRuleset.name,
              }),
              snackType: 'error',
            });
          }
        })
        .catch(error => {
          const errorResponse = error.response.data;
          let key = 'editFail';
          // if (Array.isArray(errorResponse) && errorResponse[0].errorDetails)
          //   key = errorResponse[0].errorDetails[0].messageKey;

          if (errorResponse && errorResponse.messageKey) {
            key =
              errorResponse.messageKey === 'ENTITY_FIELD_DUPLICATE'
                ? errorResponse.messageKey
                : key;
          }

          this.apiCalled = false;
          this.setState({
            showRuleSetInfo: true,
            currentRuleSet: this.state.currentRuleSet,
            selectedRuleset: this.state.selectedRuleset,
            selectedNodePath: this.state.selectedNodePath,
            message: this.props.t(`ERRORS.RULESET.${key}`, {
              ruleSet: selectedRuleset.name,
            }),
            snackType: 'error',
          });
        });
    }
  };

  render() {
    const {
      t,
      editMode,
      openItemId,
      openItemName,
      readOnly,
      ...rest
    } = this.props;
    const {
      treeData,
      deleteDialogIsOpen,
      type,
      selectedRuleset,
      message,
      snackType,
      currentRuleSet,
    } = this.state;
    const entityText = 'DATA.ruleSets';
    return (
      <React.Fragment>
        <AccessEnabler
          scopes={scopes.rules.rulesetManage}
          disableComponent
          render={props => (
            <RuleSetInfo
              anchor={'right'}
              isOpen={this.state.showRuleSetInfo}
              handleCancel={() => this.closeForm('showRuleSetInfo')}
              handleOk={this.updateRuleSetInfo}
              ruleset={currentRuleSet}
              readOnly={readOnly}
              disableComponent={props.disableComponent}
              t={t}
            />
          )}
        />
        <AddHeader
          t={t}
          name={t(`${entityText}.name`)}
          editMode={editMode}
          openItemId={openItemId}
          openItemName={openItemName}
          needAddButton={false}
          className="tm-scenario_data_ruleset__create-btn"
          redirectLink={
            <RedirectLink
              to={{
                pathname: `../rules`,
                state: {
                  editMode,
                  openItemId,
                  openItemName,
                  readOnly,
                },
              }}
            >
              {t('GLOBAL.redirectTo', {
                data: t('DATA.rules.name').toLowerCase(),
              })}
            </RedirectLink>
          }
          readOnly={readOnly}
          {...rest}
        />
        <Container>
          {editMode && <EditModeBar title={t('TEMPLATES.editMode')} />}
          <TreeDiv ref={this.ruleSetContainer}>
            <SortableTree
              treeData={treeData}
              onChange={treeData => this.onChangeTreeData(treeData)}
              canDrag={false}
              canDrop={false}
              rowHeight={this.setRowHeight}
              generateNodeProps={this.generateNodeProps}
              style={{ height: this.state.calculatedHeight + 'px' }}
            />
          </TreeDiv>
          {deleteDialogIsOpen && (
            <DeleteDialog
              open={deleteDialogIsOpen}
              handleOk={this.handleDelete}
              onExited={this.closeDeleteDialog}
              handleCancel={this.closeDeleteDialog}
              modalCommand={true}
              onClose={this.closeDeleteDialog}
              okText={t('GLOBAL.form.delete')}
              title={t('DIALOG.DELETE_DATA.title', {
                type: t(type).toLowerCase(),
                name: selectedRuleset.name || ' ',
              })}
              bodyText={t('DIALOG.DELETE_DATA.body', {
                type: t(type).toLowerCase(),
                name: selectedRuleset.name || ' ',
              })}
              t={t}
            />
          )}
          <Notification
            message={message}
            clear={this.onClearSnackBar}
            type={snackType}
            autoHideDuration={snackType === 'error' ? 360000 : 5000}
          />
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state;
  return { userData: user.userData, userPermissions: user.permissions };
};

RuleSet.propTypes = {
  t: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  openItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  openItemName: PropTypes.string.isRequired,
  handleDeleteError: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  reportError: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    userName: PropTypes.string,
  }),
  userPermissions: PropTypes.shape([]).isRequired,
};

RuleSet.defaultProps = {
  readOnly: false,
  userData: {},
};

const RuleSetComponent = connect(mapStateToProps)(RuleSet);

export default withErrorHandler(
  withDeleteHandler(RuleSetComponent)(ruleSetType)
);
