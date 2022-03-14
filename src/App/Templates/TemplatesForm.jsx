import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import InputMUI from '@material-ui/core/TextField';
import MUIFormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import Dialog from '../../components/Dialog/Form';
import AutoComplete from '../../components/Autocomplete/AutoComplete.jsx';
import ErrorMessage from '../../components/FormValidation/ErrorMessage';
import TextArea from '../../components/TextArea';
import { TEMPLATE_NAME_REGEX } from './constants';
import { evaluateRegex } from '../../utils/common';

const FormControl = styled(MUIFormControl)`
  width: 100%;
`;

const AddDialog = styled(Dialog)`
  & div:last-child form {
    width: 560px;
    max-width: 560px;
  }

  & div:last-child form > div:first-child > span:nth-child(1) {
    margin-bottom: 10px;
    display: block;
    color: rgba(0, 0, 0, 0.87);
  }

  & div:last-child form > div:first-child > div:nth-child(4) {
    margin-top: 16px;
    & .Select-menu {
      max-height: 140px;
    }
  }
  & div:last-child form > div:first-child > div:nth-child(5) {
    margin-bottom: 10px;
  }
  & .MuiInputAdornment-positionStart {
    margin-right: 0px;
  }
`;

const Input = styled(InputMUI)`
  & label {
    color: rgba(0, 0, 0, 0.87);
  }

  &.error > label {
    color: #d10000 !important;
  }
`;

class TemplatesForm extends Component {
  state = {
    templateName: '',
    sourceTemplate: '-1',
    categoryName: '',
    errors: {
      templateName: false,
    },
  };

  validateTempNameAndSetErrors = () => {
    const { templateName, errors } = this.state;
    if (templateName !== '') {
      const isValidRegex = evaluateRegex(TEMPLATE_NAME_REGEX, templateName);
      this.setState({ errors: { ...errors, templateName: !isValidRegex } });
    } else {
      this.setState({ errors: { ...errors, templateName: false } });
    }
  };

  getTemplateId = templateName => {
    let templateToFind = '-1';
    this.props.templateSuggestions.forEach(template => {
      if (template.label === templateName) templateToFind = template.value;
    });

    return templateToFind;
  };
  componentDidMount() {
    this.setState({ sourceTemplate: this.getTemplateId('Blank') });
  }

  handleChange = e => {
    const name = e.target.name;
    this.setState({ [name]: e.target.value }, () => {
      switch (name) {
        case 'templateName':
          this.validateTempNameAndSetErrors();
          break;
        default:
          return 0;
      }
    });
  };

  isValidForm = () => {
    return (
      this.state.templateName.trim() === '' ||
      this.state.sourceTemplate === null ||
      this.state.sourceTemplate === '-1'
    );
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.open) {
      this.setState({
        templateName: '',
        sourceTemplate: this.getTemplateId('Blank'),
        categoryName: '',
      });
    }
  }

  onAutocompleteChange(name, value) {
    this.setState({ [name]: value });
  }

  render() {
    const { formId, t, templateSuggestions, categories, ...rest } = this.props;
    const { templateName, sourceTemplate, categoryName, errors } = this.state;

    return (
      <AddDialog
        title={t('TEMPLATES.formTitle')}
        formId={formId}
        disableSave={this.isValidForm() || errors.templateName}
        {...rest}
      >
        <span>{t('TEMPLATES.sourceTemplateTitle')}</span>
        <AutoComplete
          id={'sourceTemplate'}
          name={'sourceTemplate'}
          placeholder={t('TEMPLATES.sourceTemplate')}
          suggestions={templateSuggestions}
          required
          value={sourceTemplate}
          defaultValue={this.getTemplateId('Blank')}
          t={t}
          onChange={value => this.onAutocompleteChange('sourceTemplate', value)}
        />
        <Input
          inputProps={{
            name: 'templateName',
            maxLength: 50,
            required: true,
          }}
          id="templateName"
          label={t('TEMPLATES.templateName')}
          margin="normal"
          required
          fullWidth
          value={templateName}
          onChange={this.handleChange}
          color="primary"
          className={errors.templateName ? 'error' : ''}
        />
        <ErrorMessage
          error={errors.templateName}
          isVisible={errors.templateName}
          message={t(`ERRORS.TEMPLATES.name`)}
        />
        <FormControl>
          <InputLabel htmlFor="category">{t('CATEGORY.label')}</InputLabel>
          <AutoComplete
            id={'category'}
            name={'category'}
            suggestions={categories}
            create={true}
            createLabel={t('CATEGORY.create')}
            t={t}
            maxLength={50}
            onChange={value => this.onAutocompleteChange('categoryName', value)}
            value={categoryName}
          />
        </FormControl>
        <TextArea
          inputProps={{
            name: 'description',
            maxLength: 1000,
          }}
          id="description"
          label={t('TEMPLATES.description')}
          margin="normal"
          style={{ display: 'block' }}
          fullWidth
          multiline
        />
      </AddDialog>
    );
  }
}
TemplatesForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleOk: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  okButton: PropTypes.string,
  cancelButton: PropTypes.string,
  templateSuggestions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
};

TemplatesForm.defaultProps = {
  okButton: '',
  cancelButton: '',
};

export default TemplatesForm;
