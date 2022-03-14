import {
  SelectInput,
  GenericTextField,
  GenericDateField,
  GenericTimeField,
  GenericBooleanType,
} from '../../../../../components/GenericCollapsibleTable/components';
import {
  validateNumbers,
  validateTime,
  validateString,
  validateDuration,
} from './validations';
import { RuleTableDialogWithConnect } from './components';

export const getValidation = data => {
  const config = {
    integerParamType: validateNumbers,
    decimalParamType: validateNumbers,
    percentageParamType: validateNumbers,
    timeParamType: validateTime,
    stringParamType: validateString,
    tokenParamType: validateString,
    durationParamType: validateDuration,
  };

  return config[data.type];
};

const getValue = data => {
  return data.value !== undefined && data.value !== null ? data.value : '';
};

export const getComponent = data => {
  const config = {
    integerParamType: {
      component: GenericTextField,
      props: {
        type: 'text',
        value: getValue(data),
        rightPadding: '',
        placeholder: '',
        style: { minWidth: '3ch' },
        maxInputLength: 8,
        minInputLength: 3,
        enableReset: true,
        pattern: /^-?(\d?|\d+)$/,
        converter: parseInt,
      },
    },
    decimalParamType: {
      component: GenericTextField,
      props: {
        type: 'text',
        value: getValue(data),
        rightPadding: '',
        placeholder: '',
        style: { minWidth: '5ch' },
        maxInputLength: 11,
        minInputLength: 5,
        enableReset: true,
        pattern: /^-?(\d?|\d+)?(\.(\d?|\d+))?$/,
        converter: parseFloat,
      },
    },
    percentageParamType: {
      component: GenericTextField,
      props: {
        type: 'text',
        value: getValue(data),
        rightPadding: ' %',
        placeholder: '',
        style: { minWidth: '3ch' },
        maxInputLength: 8,
        minInputLength: 3,
        enableReset: true,
        pattern: /^(\d?|\d+)?(\.(\d?|\d+))?$/,
        converter: parseFloat,
      },
    },
    stringParamType: {
      component: GenericTextField,
      props: {
        type: 'text',
        value: getValue(data),
        rightPadding: '',
        placeholder: '',
        style: { minWidth: '5ch' },
        maxInputLength: 100,
        minInputLength: 5,
        enableReset: true,
      },
    },
    tokenParamType: {
      component: GenericTextField,
      props: {
        type: 'text',
        value: getValue(data),
        rightPadding: '',
        placeholder: '',
        style: { minWidth: '5ch' },
        maxInputLength: 50,
        minInputLength: 5,
        enableReset: true,
        converter: str => str.replace(/ +/g, ''),
      },
    },
    timeParamType: {
      component: GenericTimeField,
      props: {
        value: getValue(data),
        enableReset: true,
        style: {
          width: '55px',
          color: '#ff650c',
        },
      },
    },
    dateParamType: {
      component: GenericDateField,
      props: {
        value: getValue(data),
        enableReset: true,
        minDate: data.min,
        maxDate: data.max,
      },
    },
    durationParamType: {
      component: GenericTextField,
      props: {
        type: 'text',
        value: getValue(data),
        rightPadding: '',
        placeholder: '0h',
        style: { minWidth: '3ch' },
        maxInputLength: 11,
        enableReset: true,
        pattern: /^(\d?\d?\d?\d?\d?\d?\d?\d?)(h\d?\d?)?$/,
      },
    },
    enumParamType: {
      component: SelectInput,
      props: {
        value: getValue(data),
        items: data.enum ? data.enum.map(e => ({ value: e, display: e })) : [],
        enableReset: true,
        style: {
          minWidth: '50px',
          fontWeight: '400',
        },
      },
    },
    booleanParamType: {
      component: GenericBooleanType,
      props: {
        value:
          typeof data.value === 'boolean' ? data.value : data.value === 'true',
        items: data.values
          ? data.values.map(v => ({
              value: v.value,
              display: v.display,
            }))
          : [],
        enableReset: true,
        style: {
          minWidth: '50px',
          fontWeight: '400',
        },
      },
    },
    dateTimeParamType: {
      // A new component for dateTimeParamType should be created now adjusted with text field
      component: GenericTextField,
      props: {
        type: 'text',
        value: getValue(data),
        rightPadding: '',
        placeholder: '',
        style: { minWidth: '5ch' },
        maxInputLength: 100,
        minInputLength: 5,
        enableReset: true,
      },
    },
    tableParamType: {
      component: RuleTableDialogWithConnect,
      props: {
        title: data.title,
        displayValue: data.displayValue,
      },
    },
  };

  return config[data.type];
};
