import { ellipsisTransformer } from '../../../../components/GenericTable/transformers';
import {
  SelectInput,
  ColorHighlighter,
  GenericSwitchField,
} from '../../../../components/GenericCollapsibleTable/components';

export const orderBy = 'name';
export const order = 'inc';

export const INITIAL_ITEMS = 25;

export const type = 'Rules';
export const ruleSetType = 'Rule set';
export const RULESET_NAME_REGEX = '^[a-zA-Z0-9].*';

export const getHeaders = (
  t,
  handleStateChange,
  handleDisable,
  highlighter,
  handleStateReset,
  handleStateTooltipDisable,
  getStateTooltipContent
) => {
  const stateData = [
    {
      value: true,
      display: t('DATA.rules.stateData.on'),
    },
    {
      value: false,
      display: t('DATA.rules.stateData.off'),
    },
  ];
  return [
    {
      field: 'name',
      filterName: 'ruleName',
      displayName: t('DATA.rules.headers.name'),
      transformer: ellipsisTransformer,
      transformerStyle: {
        maxWidth: '235px',
      },
      transformerProps: {
        maxWidth: '350px',
      },
      togglePane: true,
    },
    {
      field: 'active',
      displayName: t('DATA.rules.headers.state'),
      component: GenericSwitchField,
      props: {
        onChange: handleStateChange, // Required prop of SelectInput Component
        items: stateData, // Required prop of SelectInput Component
        handleDisable, // Required prop of SelectInput Component
        enableReset: true, // Required prop of SelectInput Component
        handleReset: handleStateReset, // Required prop of SelectInput Component
        handleTooltipDisable: handleStateTooltipDisable, // Required prop of SelectInput Component
        getTooltipContent: getStateTooltipContent, // Required prop of SelectInput Component
      },
      componentStyle: {
        width: '120px',
        fontSize: '0.8125rem',
      },
      filterComponent: SelectInput,
      filterComponentProps: {
        items: [
          {
            value: ' ',
            display: t('DATA.rules.stateData.all'),
          },
          ...stateData,
        ], // Required prop of SelectInput Component
        handleDisable: () => false, // Required prop of SelectInput Component
        enableReset: false, // Required prop of SelectInput Component
        defaultValue: ' ',
      },
      filterComponentStyle: {
        width: '170px',
        fontSize: '0.8125rem',
        backgroundColor: '#fff',
        paddingLeft: '5px',
        marginLeft: '15px',
        border: '1px solid',
      },
      cellStyle: {
        width: '120px',
      },
    },
    {
      field: 'settingsFromRulesetName',
      displayName: t('DATA.rules.headers.settingsFrom'),
      component: ColorHighlighter,
      componentStyle: {
        color: '#FF650C',
      },
      props: {
        highlighter, // Required prop of ColorHighlighter Component
      },
      togglePane: true,
    },
    {
      field: 'ruleCategoryName',
      displayName: t('DATA.rules.headers.category'),
      togglePane: true,
    },
    {
      field: 'ruleTypeName',
      displayName: t('DATA.rules.headers.type'),
      togglePane: true,
    },
  ];
};
