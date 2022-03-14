import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Collapse from '@material-ui/core/Collapse';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import { generateTabsData, scrollPercentage } from './helpers';
import SierraTabs from './../../../../_shared/components/SierraTabs/';
import SierraTooltip from './../../../../_shared/components/SierraTooltip/';
import { tmd } from '../../../../_shared/tmd';
import { getParamArray } from '../../Import/helpers';
import { errorsCatalog } from '../../Import/const';
import { debounce } from 'lodash';
import { ALERT_PAGE_SIZE, SCROLL_LIMIT } from './constants';
import { perfectScrollConfig } from '../../../../utils/common';

const StyledIntegrationAlerts = styled.div`
  background-color: #fff;
  border-style: solid;
  border-width: 1px;
  border-color: #ccc;
  border-top-color: #d10000;
  border-top-width: 7px;
  border-bottom-width: 0;
  border-radius: 4px 4px 0 0;
  position: absolute;
  bottom: 0px;
  width: 350px;
  right: 50px;
`;

const StyledIcon = styled(({ actionable, ...props }) => <Icon {...props} />)`
  margin: 10px;
  cursor: ${props => (props.actionable ? 'pointer' : 'default')};
`;

const StyledTitle = styled.div`
  color: rgba(0, 0, 0, 0.87);
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  font-weight: 500;
  height: 50px;
  display: flex;
  align-items: center;

  .text {
    flex-grow: 1;
    margin-left: 8px;
  }
`;

const StyledList = styled.div`
  max-height: 330px;
  min-height: 330px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const StyledAlertRow = styled.div`
  border-bottom: 1px solid #ccc;
  color: rgba(0, 0, 0, 0.87);
  display: flex;
  align-items: center;
  font-size: 13px;
  padding: 14px;

  .text {
    margin-right: 8px;
    min-width: 270px;
    > p {
      margin-top: 2px;
      margin-bottom: 2px;
    }
  }

  &:last-child {
    border-bottom: none;
  }
`;

class IntegrationsAlerts extends Component {
  state = {
    open: false,
    selectedTab: '',
    tabsData: [],
    endIndex: ALERT_PAGE_SIZE,
  };

  listRef = React.createRef();

  componentWillMount() {
    const { importErrors, t } = this.props;
    if (importErrors.total !== 0) {
      const selectedTab = Object.keys(importErrors.datatypes)[0];
      const tabsData = generateTabsData(importErrors.datatypes, t);
      this.setState({ selectedTab, tabsData });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { importErrors, t } = nextProps;
    const { selectedTab } = this.state;
    if (importErrors.total > 0) {
      const newState = {};

      if (
        selectedTab === '' ||
        !Object.hasOwnProperty.call(importErrors.datatypes, selectedTab)
      ) {
        newState.selectedTab = Object.keys(importErrors.datatypes)[0];
      }

      newState.tabsData = generateTabsData(importErrors.datatypes, t);
      this.setState(newState);
    }
  }

  toggle = () => {
    this.setState(state => ({
      open: !state.open,
    }));
  };

  handleChange = (event, value) => {
    const { selectedTab, endIndex } = this.state;
    const { importErrors } = this.props;
    if (value !== selectedTab) {
      this.listRef.scrollTop = 0;
      const errors = importErrors.datatypes[value].errors;
      this.setState({
        selectedTab: value,
        startIndex: 0,
        endIndex: ALERT_PAGE_SIZE,
      });
    }
  };

  generateRows = dataType => {
    const { t, importErrors, removeError } = this.props;
    const { endIndex } = this.state;
    const errors = importErrors.datatypes[dataType].errors;
    const paginatedErrors = errors.slice(0, endIndex);

    const rows = paginatedErrors.map((v, i) => {
      const error = errors[i];
      const formattedAlert = [];
      const errorId = `${dataType}-${error.id}`;

      try {
        const key = error.messageKey;
        const params = error.messageArguments;

        if (key in errorsCatalog) {
          const errorConfig = errorsCatalog[key];

          errorConfig.forEach(element => {
            const uniqueKey = `${element.key}-${i}`;
            switch (element.key) {
              case 'value': {
                const line = <b key={uniqueKey}>{params[element.paramId]}</b>;
                formattedAlert.push(line);
                break;
              }
              case 'refersToPosition':
              case 'refersToAirline':
              case 'refersToStation':
              case 'refersToDeadhead':
              case 'refersToCrewBase':
              case 'refersToAircraftType': {
                const line = tmd(
                  t,
                  uniqueKey,
                  `ERRORS.IMPORT.errors.${element.key}`
                );
                formattedAlert.push(line);
                break;
              }
              case 'pairingNotImported':
              case 'deadHeadAggregateNotImported':
              case 'mockedMarkedObsolete':
              case 'deletingPairing':
              case 'markedObsolete':
              case 'flightNotImported': {
                const lineParams = getParamArray(element.paramId, params);
                const line = tmd(
                  t,
                  uniqueKey,
                  `ERRORS.IMPORT.errors.${element.key}`,
                  lineParams
                );
                formattedAlert.push(line);
                break;
              }
              default:
                break;
            }
          });
        } else {
          formattedAlert.push(
            tmd(t, `undefined-${i}`, 'ERRORS.IMPORT.errors.undefined')
          );
        }
      } catch (error) {
        console.error(error);
      }

      return (
        <StyledAlertRow key={`alert-${dataType}-${i}`}>
          <span className="text">{formattedAlert}</span>

          <SierraTooltip
            position="bottom"
            title={t('DATA.integrationAlerts.dontShow')}
          >
            <IconButton
              color="primary"
              component="span"
              onClick={() => removeError(errorId)}
            >
              <Icon color="primary">visibility_off</Icon>
            </IconButton>
          </SierraTooltip>
        </StyledAlertRow>
      );
    });
    return rows;
  };

  handleScroll = debounce(() => {
    const { scrollHeight, scrollTop } = this.listRef;
    const { selectedTab, endIndex } = this.state;
    const { importErrors } = this.props;
    const errors = importErrors.datatypes[selectedTab].errors;

    if (
      scrollPercentage(scrollHeight, scrollTop) > SCROLL_LIMIT &&
      endIndex < errors.length - 1
    ) {
      this.setState({
        endIndex: endIndex + ALERT_PAGE_SIZE,
      });
    }
  }, 1000);

  render() {
    const { open, selectedTab, tabsData } = this.state;
    const { t, importErrors } = this.props;
    const expandIconName = open ? 'expand_more' : 'expand_less';
    const alertsTotalCount = importErrors.total;

    return (
      alertsTotalCount && (
        <StyledIntegrationAlerts>
          <StyledTitle>
            <StyledIcon color="error">error</StyledIcon>
            <span className="text">
              {t('DATA.integrationAlerts.alerts')} ({alertsTotalCount})
            </span>
            <StyledIcon actionable onClick={this.toggle}>
              {expandIconName}
            </StyledIcon>
          </StyledTitle>
          <Collapse in={open}>
            <SierraTabs
              value={selectedTab}
              onChange={this.handleChange}
              variant="scrollable"
              scrollButtons="auto"
              tabs={tabsData}
            />
            <StyledList>
              <PerfectScrollbar
                containerRef={ref => {
                  this.listRef = ref;
                }}
                onScrollY={this.handleScroll}
                option={perfectScrollConfig}
              >
                <div style={{ maxHeight: 330 }}>
                  {this.generateRows(selectedTab)}
                </div>
              </PerfectScrollbar>
            </StyledList>
          </Collapse>
        </StyledIntegrationAlerts>
      )
    );
  }
}

IntegrationsAlerts.propTypes = {
  t: PropTypes.func.isRequired,
  importErrors: PropTypes.shape().isRequired,
  removeError: PropTypes.func.isRequired,
};
export default IntegrationsAlerts;
