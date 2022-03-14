import { t } from 'i18next';
import {
  SelectInput,
  GenericTextField,
  GenericDateField,
  GenericTimeField,
  ColorHighlighter,
  GenericSwitchField,
  AutoCompleteComboBox,
  GenericTimeRangeField,
} from '../../../../../../../components/GenericCollapsibleTable/components';
import {
  getFixedSimpleTableTransformer,
  getFixedTableTransformer,
  getSimpleListTableTransformer,
  getListTableTransformer,
  getMultidimensionalTableTransformer,
} from './transformers';

export const getComponent = (data, { resolveDynamicEnum }) => {
  const config = {
    title: {
      component: ColorHighlighter,
      props: {
        style: { color: '#000000', fontWeight: '500' },
        highlighter: () => true,
      },
    },
    listTitle: {
      component: ColorHighlighter,
      props: {
        style: { color: '#000000', fontWeight: '500' },
        highlighter: () => true,
      },
    },
    integerParamType: {
      component: GenericTextField,
      props: {
        type: 'text',
        rightPadding: '',
        placeholder: '',
        maxInputLength: 8,
        minInputLength: 3,
        pattern: /^-?(\d?|\d+)$/,
        converter: parseInt,
      },
      componentStyle: {
        minWidth: '65px',
      },
    },
    decimalParamType: {
      component: GenericTextField,
      props: {
        type: 'text',
        rightPadding: '',
        placeholder: '',
        maxInputLength: 11,
        minInputLength: 5,
        pattern: /^-?(\d?|\d+)?(\.(\d?|\d+))?$/,
        converter: parseFloat,
      },
      componentStyle: {
        minWidth: '65px',
      },
    },
    percentageParamType: {
      component: GenericTextField,
      props: {
        type: 'text',
        rightPadding: ' %',
        placeholder: '',
        maxInputLength: 8,
        minInputLength: 3,
        pattern: /^(\d?|\d+)?(\.(\d?|\d+))?$/,
        converter: parseFloat,
      },
      componentStyle: {
        minWidth: '65px',
      },
    },
    stringParamType: {
      component: GenericTextField,
      props: {
        type: 'text',
        rightPadding: '',
        placeholder: '',
        maxInputLength: 100,
        minInputLength: 5,
      },
      componentStyle: {
        minWidth: '65px',
      },
    },
    tokenParamType: {
      component: GenericTextField,
      props: {
        type: 'text',
        rightPadding: '',
        placeholder: '',
        maxInputLength: 50,
        minInputLength: 5,
        converter: str => str.replace(/ +/g, ''),
      },
      componentStyle: {
        minWidth: '65px',
      },
    },
    timeParamType: {
      component: GenericTimeField,
      props: {
        variant: 'inline',
      },
      componentStyle: {
        width: '65px',
        color: '#ff650c',
      },
    },
    timeRangeParamType: {
      component: GenericTimeRangeField,
      props: {
        fromPlaceHolder: t('DYNAMIC_TABLE.timeRangePicker.from'),
        toPlaceHolder: t('DYNAMIC_TABLE.timeRangePicker.to'),
      },
      componentStyle: {
        width: '64px',
        fontSize: '14px',
        color: '#000000',
      },
    },
    dateParamType: {
      component: GenericDateField,
      props: {
        minDate: data.rules ? data.rules.min : null,
        maxDate: data.rules ? data.rules.max : null,
      },
      componentStyle: {
        width: '120px',
        fontSize: '0.8125rem',
      },
    },
    durationParamType: {
      component: GenericTextField,
      props: {
        type: 'text',
        rightPadding: '',
        placeholder: '0h',
        maxInputLength: 11,
        pattern: /^(\d?\d?\d?\d?\d?\d?\d?\d?)(h\d?\d?)?$/,
      },
      componentStyle: {
        minWidth: '65px',
      },
    },
    enumParamType: {
      component: SelectInput,
      props: {
        items: data.enum ? data.enum.map(e => ({ value: e, display: e })) : [],
      },
      componentStyle: {
        minWidth: '80px',
        fontWeight: '400',
      },
    },
    dynamicEnumParamType: {
      component: AutoCompleteComboBox,
      props: {
        suggestions: resolveDynamicEnum(data.enumType),
      },
      componentStyle: {
        minWidth: '95px',
        width: '95px',
        fontWeight: '400',
      },
    },
    booleanParamType: {
      component: SelectInput,
      props: {
        items: data.values
          ? data.values.map(v => ({
              value: v.value,
              display: v.display,
            }))
          : [],
      },
      componentStyle: {
        minWidth: '80px',
        fontWeight: '400',
      },
    },
    switchParamType: {
      component: GenericSwitchField,
      props: {
        items: [
          {
            value: true,
            display: t('DYNAMIC_TABLE.switchComponent.yes'),
          },
          {
            value: false,
            display: t('DYNAMIC_TABLE.switchComponent.no'),
          },
        ],
      },
      componentStyle: {
        minWidth: '50px',
        fontWeight: '400',
      },
    },
    dateTimeParamType: {
      // A new component for dateTimeParamType should be created now adjusted with text field
      component: GenericTextField,
      props: {
        type: 'text',
        rightPadding: '',
        placeholder: '',
        maxInputLength: 100,
        minInputLength: 5,
      },
      componentStyle: {
        minWidth: '65px',
      },
    },
  };
  return config[data.type];
};

export const getHeaders = (
  headers,
  {
    handleParamChange,
    removeOverlay,
    resolveDynamicEnum,
    defaultRules,
    defaultPlaceholder,
    handleDisable,
  }
) => {
  return headers.map(header => {
    const component = getComponent(header, { resolveDynamicEnum });
    const rules = header.rules || defaultRules || {};
    const placeholder = header.displayName
      ? header.displayName
      : defaultPlaceholder;

    if (component) {
      return {
        ...header,
        component: component.component,
        componentStyle: component.componentStyle,
        cellStyle: component.cellStyle,
        rules,
        placeholder,
        props: {
          ...component.props,
          onChange: handleParamChange,
          removeOverlay,
          handleDisable,
        },
      };
    }
    return header;
  });
};

export const getDefaultComponentConfigs = (
  type,
  {
    handleParamChange,
    removeOverlay,
    resolveDynamicEnum,
    defaultRules,
    defaultPlaceholder,
    handleDisable,
  }
) => {
  const component = getComponent({ type }, { resolveDynamicEnum });
  const rules = defaultRules || {};
  if (component) {
    return {
      component: component.component,
      componentStyle: component.componentStyle,
      cellStyle: component.cellStyle,
      rules,
      placeholder: defaultPlaceholder || '',
      props: {
        ...component.props,
        onChange: handleParamChange,
        removeOverlay,
        handleDisable,
      },
    };
  }
  return null;
};

export const getComponentDefaults = type => {
  const config = {
    integerParamType: {
      defaultValue: '',
    },
    decimalParamType: {
      defaultValue: '',
    },
    percentageParamType: {
      defaultValue: '',
    },
    stringParamType: {
      defaultValue: '',
    },
    tokenParamType: {
      defaultValue: '',
    },
    timeParamType: {
      defaultValue: '00:00',
    },
    dateParamType: {
      defaultValue: new Date(),
    },
    durationParamType: {
      defaultValue: '',
    },
    enumParamType: {
      defaultValue: null,
    },
    dynamicEnumParamType: {
      defaultValue: '',
    },
    booleanParamType: {
      defaultValue: false,
    },
    switchParamType: {
      defaultValue: false,
    },
    dateTimeParamType: {
      defaultValue: '',
    },
    timeRangeParamType: {
      defaultValue: '',
    },
  };
  return config[type];
};

export const getTableConfiguration = type => {
  const config = {
    fixed: {
      paddingBottom: '50px',
      showRowOptions: false,
      showColumnOptions: false,
      showFooter: false,
      showColumnDivider: false,
      getTransformer: getFixedTableTransformer,
    },
    fixedSimple: {
      paddingBottom: '50px',
      showRowOptions: false,
      showColumnOptions: false,
      showFooter: false,
      showColumnDivider: false,
      getTransformer: getFixedSimpleTableTransformer,
    },
    fixedColumn: {
      paddingBottom: '50px',
      showRowOptions: true,
      showColumnOptions: false,
      showFooter: true,
      showColumnDivider: false,
      getTransformer: getFixedTableTransformer,
    },
    fixedColumnSimple: {
      paddingBottom: '50px',
      showRowOptions: true,
      showColumnOptions: false,
      showFooter: true,
      showColumnDivider: false,
      getTransformer: getFixedSimpleTableTransformer,
    },
    simpleList: {
      paddingBottom: '50px',
      showRowOptions: true,
      showColumnOptions: false,
      showFooter: true,
      showColumnDivider: false,
      getTransformer: getSimpleListTableTransformer,
    },
    list: {
      paddingBottom: '50px',
      showRowOptions: true,
      showColumnOptions: false,
      showFooter: true,
      showColumnDivider: false,
      getTransformer: getListTableTransformer,
    },
    variableColumnFixedType: {
      paddingBottom: '23px',
      showRowOptions: true,
      showColumnOptions: true,
      showFooter: true,
      showColumnDivider: false,
      getTransformer: getFixedTableTransformer,
    },
    fixedMuliDimensional: {
      paddingBottom: '23px',
      showRowOptions: false,
      showColumnOptions: false,
      showFooter: false,
      showColumnDivider: false,
      getTransformer: getMultidimensionalTableTransformer,
    },
  };
  return config[type] ? config[type] : {};
};

export const getSortType = type => {
  switch (type) {
    case 'title': {
      return 'string';
    }
    case 'integerParamType': {
      return 'number';
    }
    case 'decimalParamType': {
      return 'number';
    }
    case 'percentageParamType': {
      return 'number';
    }
    case 'stringParamType': {
      return 'string';
    }
    case 'tokenParamType': {
      return 'string';
    }
    case 'timeParamType': {
      return 'time';
    }
    case 'dateParamType': {
      return 'date';
    }
    case 'durationParamType': {
      return 'duration';
    }
    case 'enumParamType': {
      return 'string';
    }
    case 'dynamicEnumParamType': {
      return 'string';
    }
    case 'booleanParamType': {
      return 'boolean';
    }
    case 'switchParamType': {
      return 'boolean';
    }
    case 'dateTimeParamType': {
      return 'string';
    }
    case 'listTitle': {
      return 'number';
    }
    default: {
      return 'string';
    }
  }
};

export const GENERAL = t('DATA.rules.ruleTable.general');

export const getExpectionMetaInfo = type => {
  const config = {
    region: {
      color: '#FF650C',
      className: 'rule-table-orange',
      belongsTo: null,
      belongsToVia: null,
      hasMany: 'station',
      hasManyVia: 'regionCode',
    },
    station: {
      color: '#00CE05',
      className: 'rule-table-green',
      belongsTo: 'region',
      belongsToVia: 'regionCode',
      hasMany: null,
      hasManyVia: null,
    },
    regionLayoverTimeMin: {
      color: '#FF650C',
      className: 'rule-table-orange',
      belongsTo: null,
      belongsToVia: null,
      hasMany: 'stationLayoverTimeMin',
      hasManyVia: 'regionCode',
    },
    stationLayoverTimeMin: {
      color: '#00CE05',
      className: 'rule-table-green',
      belongsTo: 'regionLayoverTimeMin',
      belongsToVia: 'regionCode',
      hasMany: null,
      hasManyVia: null,
    },
  };
  return config[type];
};
