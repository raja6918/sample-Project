import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Form from '../../../components/Dialog/Form';
import Icon from '../../../components/Icon';
import SierraTabs from '../../../_shared/components/SierraTabs';

import { dataTypesComplement } from './importConfig';
import { tmd } from '../../../_shared/tmd';
import { warningsCatalog } from './const';
import { getConversionParamArray } from './helpers';
import { perfectScrollConfig } from '../../../utils/common';

const AddDialog = styled(Form)`
  & form > div:first-child {
    max-width: 655px;
    max-height: 680px;
    overflow-y: hidden;
    padding: 20px 20px 0 20px;
  }
  & > div:last-child {
    max-width: 655px;
  }
  & form > div:last-child {
    button {
      width: auto !important;
      padding-left: 8px;
      padding-right: 8px;
    }
  }
`;

const AlertItem = styled(({ summary, ...props }) => <div {...props} />)`
  ${props =>
    props.summary &&
    css`
      align-items: center;
      display: flex;
    `};
  padding: 10px;
  border-bottom: 1px solid #e5e5e5;

  & > p {
    margin-top: 2px;
    margin-bottom: 2px;
  }

  .bold {
    font-weight: 500;
  }
`;

const DataLine = styled.p`
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
  max-width: 555px;
  text-overflow: ellipsis;
`;

const InfoContainer = styled.div`
  height: 300px;
  padding: 0px 15px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.87);
  /* overflow-y: auto; */
`;

const TitleSection = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-size: 14px;
  display: flex;
  padding-bottom: 10px;

  & span.mainTitle {
    font-weight: 500;
  }

  & p {
    margin-top: 6px;
    margin-bottom: 4px;
  }
`;

class DataConversionDialog extends Component {
  state = {
    selectedTab: '',
  };
  contentRef = React.createRef();

  componentWillReceiveProps(nextProps) {
    if (Object.keys(nextProps.conversionWarnings).length !== 0) {
      const selectedTab = Object.keys(
        nextProps.conversionWarnings.datatypes
      )[0];
      if (!!selectedTab) this.setState({ selectedTab });
    }
  }

  generateTabTitles = () => {
    const { t, conversionWarnings } = this.props;
    return Object.keys(conversionWarnings.datatypes).map(dataType => {
      const label = t(dataTypesComplement[dataType].translationKey);
      const count = `(${conversionWarnings.datatypes[dataType].skippedRecords})`;
      const value = dataType;

      return {
        value,
        label: (
          <React.Fragment>
            <div>{label}</div>
            <div>{count}</div>
          </React.Fragment>
        ),
      };
    });
  };

  handleTabChange = (event, value) => {
    this.contentRef.current.scrollTop = 0;
    this.setState({ selectedTab: value });
  };

  GenerateAlert = selectedTab => {
    const { conversionWarnings, t } = this.props;
    const alertRows = [];
    const { errors } = conversionWarnings.datatypes[selectedTab];

    for (let i = 0; i < errors.length; i++) {
      const warning = errors[i];
      const formattedAlert = [];
      try {
        const key = warning.messageKey;
        const params = warning.messageArguments;

        if (key in warningsCatalog) {
          const warningConfig = warningsCatalog[key];

          warningConfig.forEach(element => {
            const uniqueKey = `${element.key}-${i}`;
            if (element.key === 'dataLine') {
              const line = (
                <DataLine key={uniqueKey}>{params[element.paramId]}</DataLine>
              );
              formattedAlert.push(line);
            } else {
              const lineParams = getConversionParamArray(
                element.paramId,
                params
              );

              const line = tmd(
                t,
                uniqueKey,
                `ERRORS.IMPORT.conversion.${element.key}`,
                lineParams
              );
              formattedAlert.push(line);
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
      alertRows.push(<AlertItem key={i}>{formattedAlert}</AlertItem>);
    }
    return alertRows;
  };

  render() {
    const {
      t,
      formId,
      open,
      closeDialog,
      handleOk,
      conversionWarnings,
    } = this.props;
    const { selectedTab } = this.state;

    if (selectedTab !== '') {
      const tabTitles = this.generateTabTitles();

      return (
        <AddDialog
          formId={formId}
          open={open}
          title={t('DATA.dataConversionModal.titleStepOne')}
          okButton={t('DATA.dataConversionModal.stopButton')}
          cancelButton={t('DATA.dataConversionModal.ignoreButton')}
          onClose={closeDialog}
          handleCancel={closeDialog}
          handleOk={handleOk}
          modalCommand={false}
        >
          <TitleSection>
            <Icon size={24} iconcolor={'#5098E7'}>
              info
            </Icon>
            <div>
              <p>
                <span className={'mainTitle'}>
                  {t('DATA.dataConversionModal.stepOneCompleted')}
                </span>
                {t('DATA.dataConversionModal.stepOneIssues')}
              </p>
              <p>{t('DATA.dataConversionModal.stepOneMessage')}</p>
            </div>
          </TitleSection>
          <SierraTabs
            value={selectedTab}
            onChange={this.handleTabChange}
            scrollable
            scrollButtons="auto"
            tabs={tabTitles}
          />
          <PerfectScrollbar option={perfectScrollConfig}>
            <InfoContainer innerRef={this.contentRef}>
              <AlertItem key={'summary'} summary>
                <Icon size={22} iconcolor={'#E8BB00'}>
                  report_problem
                </Icon>
                <div>
                  <span className="bold">
                    {t('DATA.dataConversionModal.skipped')}
                  </span>
                  {`${conversionWarnings.datatypes[selectedTab].skippedRecords}/${conversionWarnings.datatypes[selectedTab].processedRecords}`}
                </div>
              </AlertItem>
              {this.GenerateAlert(selectedTab)}
            </InfoContainer>
          </PerfectScrollbar>
        </AddDialog>
      );
    }

    return null;
  }
}

DataConversionDialog.propTypes = {
  t: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
  handleOk: PropTypes.func.isRequired,
  conversionWarnings: PropTypes.shape().isRequired,
};

export default DataConversionDialog;
