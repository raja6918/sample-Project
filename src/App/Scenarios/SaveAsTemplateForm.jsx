import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Grid from '@material-ui/core/Grid';
import Dialog from '../../components/Dialog/Form';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MUIFormControl from '@material-ui/core/FormControl';

import AutoComplete from '../../components/Autocomplete/AutoComplete';
import TextArea from '../../components/TextArea';

import templatesServices from '../../services/Templates';
import ErrorMessage from '../../components/FormValidation/ErrorMessage';
import { SCENARIO_NAME_REGEX } from './constants';
import { evaluateRegex } from '../../utils/common';

const FormDialog = styled(Dialog)`
  & div:last-child form {
    width: 560px;
    max-width: 560px;
  }

  &
    > div:last-child
    form
    > div:first-child
    > div:nth-child(2)
    > div:nth-child(2) {
    & .Select-menu {
      max-height: 140px;
    }
  }
  & .MuiInputAdornment-positionStart {
    margin-right: 0px;
  }
`;

const Input = styled(TextField)`
  margin: 0;
  width: 100%;
  & label {
    color: rgba(0, 0, 0, 0.87);
  }
  &.error > label {
    color: #d10000 !important;
  }
`;

const FormControl = styled(MUIFormControl)`
  width: 100%;
`;

const Labels = styled.div`
  font-size: 16px;
`;

const ScenarioName = styled.p`
  font-size: 16px;
  margin: 9px 0 0 0;
`;

class SaveAsTemplateForm extends Component {
  state = {
    categoryName: 'All',
    templateName: '',
    description: '',
    categories: [],
    errors: {
      templateName: false,
    },
  };

  componentWillMount() {
    templatesServices
      .getCategories()
      .then(categories => {
        categories = categories.map(category => ({
          value: category,
          label: category,
        }));
        this.setState({ categories });
      })
      .catch(error => {
        console.error(error);
      });
  }

  componentWillReceiveProps() {
    this.setState({ templateName: '', categoryName: 'All', description: '' });
  }

  //commented this code bcoz the func changeOnForm is not defined and dont know the purpose
  // handleOnFormEnter = () => {
  //   const form = document.getElementById(this.props.formId);
  //   if (form) {
  //     form.addEventListener('input', this.changeOnForm);
  //   }
  // };

  // handleFormClose = () => {
  //   const form = document.getElementById(this.props.formId);
  //   if (form) {
  //     form.removeEventListener('input', this.changeOnForm);
  //   }
  // };

  validateTempNameAndSetErrors = () => {
    const { templateName, errors } = this.state;
    if (templateName !== '') {
      const isValidRegex = evaluateRegex(SCENARIO_NAME_REGEX, templateName);
      this.setState({ errors: { ...errors, templateName: !isValidRegex } });
    } else {
      this.setState({ errors: { ...errors, templateName: false } });
    }
  };

  onChange = event => {
    this.setState(
      { templateName: event.target.value },
      this.validateTempNameAndSetErrors
    );
  };

  render() {
    const { t, scenario, formId, ...rest } = this.props;
    const {
      categoryName,
      templateName,
      description,
      categories,
      errors,
    } = this.state;

    return (
      <FormDialog
        title={t('SCENARIOS.form.asTemplate.title')}
        okButton={'Ok'}
        formId={formId}
        disableSave={templateName.trim() === '' || errors.templateName}
        {...rest}
      >
        <Labels>
          {t('SCENARIOS.form.asTemplate.subtitle')}
          <ScenarioName>{scenario}</ScenarioName>
        </Labels>
        <Grid container>
          <Grid item xs={12} style={{ margin: '16px auto 5px auto' }}>
            <Input
              inputProps={{
                name: 'templateName',
                maxLength: 50,
                required: true,
              }}
              id="templateName"
              label={t('SCENARIOS.form.asTemplate.labels.templateName')}
              margin="normal"
              onChange={this.onChange}
              defaultValue={templateName}
              required
              className={errors.templateName ? 'error' : ''}
            />
            <ErrorMessage
              error={errors.templateName}
              isVisible={errors.templateName}
              message={t(`ERRORS.TEMPLATES.name`)}
            />
          </Grid>
          <Grid item xs={12} style={{ margin: '10px 0 0 auto' }}>
            <FormControl>
              <InputLabel htmlFor="category">{t('CATEGORY.label')}</InputLabel>
              <AutoComplete
                id={'category'}
                name={'category'}
                suggestions={categories}
                value={categoryName}
                create={true}
                createLabel={t('CATEGORY.create')}
                onChange={value => this.setState({ categoryName: value })}
                maxLength={50}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextArea
              inputProps={{
                name: 'description',
                maxLength: 1000,
              }}
              id="description"
              label={t('SCENARIOS.form.asTemplate.labels.description')}
              margin="normal"
              defaultValue={description}
              fullWidth
              multiline
            />
          </Grid>
        </Grid>
      </FormDialog>
    );
  }
}

SaveAsTemplateForm.propTypes = {
  t: PropTypes.func.isRequired,
  scenario: PropTypes.string,
  formId: PropTypes.string.isRequired,
};

SaveAsTemplateForm.defaultProps = {
  scenario: '',
};
export default SaveAsTemplateForm;
