import React, { Component } from 'react';
import PropType from 'prop-types';
import styled from 'styled-components';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import Form from '../../components/FormDrawer/Form';
import FormHeader from '../../components/FormDrawer/FormHeader';
import FormBody from '../../components/FormDrawer/FormBody';

import { stringDateTime } from '../../utils/dates';
import { perfectScrollConfig } from '../../utils/common';

const BodySection = styled(FormBody)`
  padding: 0;
`;
const InfoLabel = styled(Typography)`
  color: rgba(0, 0, 0, 0.67);
  font-size: 12px;
`;
const ContentLabel = styled(Typography)`
  color: rgba(0, 0, 0, 0.87);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const TabContent = styled.div`
  /* padding: 24px; */
  height: calc(100vh - 224px);
  overflow: auto;
`;

class GetTemplateInfoForm extends Component {
  state = {
    isFormDirty: false,
    tabSelected: 0,
  };

  getItemInfo = property => {
    const { template } = this.props;

    return template && template[property] ? template[property].toString() : '';
  };

  handleChangeTab = (event, tabSelected) => {
    this.setState({ tabSelected });
  };

  render() {
    const { template, formId, t, ...rest } = this.props;
    const { tabSelected } = this.state;
    const globalForm = 'GLOBAL.form';
    const getInfo = 'TEMPLATES.getInfo';

    return (
      template && (
        <Form
          cancelButton={t(`${globalForm}.close`)}
          okButton={t(`${globalForm}.save`)}
          formId={formId}
          isDisabled={true}
          onChange={() => {}}
          anchor={'right'}
          {...rest}
        >
          <FormHeader>
            <span>{t('GLOBAL.menu.getInfo')}</span>
            <span>{template.name}</span>
          </FormHeader>
          <BodySection>
            <AppBar
              position="static"
              color="default"
              style={{ boxShadow: 'none' }}
            >
              <Tabs
                variant="fullWidth"
                value={tabSelected}
                onChange={this.handleChangeTab}
              >
                <Tab label={t(`${getInfo}.detailsTab`)} />
                <Tab label={t(`${getInfo}.notesTab`)} disabled />
              </Tabs>
            </AppBar>
            {tabSelected === 0 && (
              <TabContent>
                <PerfectScrollbar option={perfectScrollConfig}>
                  <div>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <InfoLabel>{t(`${getInfo}.templateName`)}:</InfoLabel>
                        <ContentLabel>{template.name}</ContentLabel>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <InfoLabel>{t(`${getInfo}.category`)}</InfoLabel>
                        <ContentLabel>{template.category}</ContentLabel>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <InfoLabel>{t(`${getInfo}.created`)}:</InfoLabel>
                        <ContentLabel>
                          {stringDateTime(template.creationTime)}
                        </ContentLabel>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <InfoLabel>{t(`${getInfo}.createdBy`)}:</InfoLabel>
                        <ContentLabel>{template.createdBy}</ContentLabel>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <InfoLabel>{t(`${getInfo}.lastModified`)}:</InfoLabel>
                        <ContentLabel>
                          {stringDateTime(template.lastModifiedTime)}
                        </ContentLabel>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <InfoLabel>{t(`${getInfo}.lastModifiedBy`)}:</InfoLabel>
                        <ContentLabel>{template.lastModifiedBy}</ContentLabel>
                      </Grid>

                      <Grid item xs={12} sm={12}>
                        <InfoLabel>{t(`${getInfo}.description`)}:</InfoLabel>
                        <ContentLabel>{template.description}</ContentLabel>
                      </Grid>
                    </Grid>
                  </div>
                </PerfectScrollbar>
              </TabContent>
            )}
            {tabSelected === 1 && <TabContent />}
          </BodySection>
        </Form>
      )
    );
  }
}

GetTemplateInfoForm.propTypes = {
  template: PropType.shape({
    category: PropType.string.isRequired,
    createdBy: PropType.string.isRequired,
    creationTime: PropType.string.isRequired,
    description: PropType.string,
    id: PropType.number.isRequired,
    isTemplate: PropType.bool.isRequired,
    lastModifiedTime: PropType.string.isRequired,
    lastModifiedBy: PropType.string.isRequired,
    name: PropType.string.isRequired,
    status: PropType.string.isRequired,
  }),
  isOpen: PropType.bool.isRequired,
  handleCancel: PropType.func.isRequired,
  formId: PropType.string.isRequired,
  t: PropType.func.isRequired,
  onClose: PropType.func.isRequired,
};
GetTemplateInfoForm.defaultProps = {
  template: null,
};
export default GetTemplateInfoForm;
