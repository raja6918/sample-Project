import { ellipsisTransformer } from '../../GenericTable/transformers';
import { SelectInput, ColorHighlighter } from '../components';

export const stateData = [
  {
    value: true,
    display: 'On',
  },
  {
    value: false,
    display: 'Off',
  },
];

const handleChange = value => {
  console.log('handle SelectInput Change', value);
};

export const getHeaders = t => [
  {
    field: 'name',
    displayName: t('DATA.rules.headers.name'),
    transformer: ellipsisTransformer,
    transformerStyle: {
      maxWidth: '235px',
    },
  },
  {
    field: 'state',
    displayName: t('DATA.rules.headers.state'),
    disableFilter: true,
    component: SelectInput,
    props: {
      onChange: handleChange,
      items: stateData,
    },
    componentStyle: {
      width: '120px',
      fontSize: '0.8125rem',
    },
    cellStyle: {
      width: '120px',
    },
  },
  {
    field: 'settingsFrom',
    displayName: t('DATA.rules.headers.settingsFrom'),
    component: ColorHighlighter,
    componentStyle: {
      color: '#FF650C',
    },
    props: {
      header: 'isEdited',
    },
  },
  {
    field: 'catagory',
    displayName: t('DATA.rules.headers.catagory'),
  },
  {
    field: 'type',
    displayName: t('DATA.rules.headers.type'),
  },
];

export const rulesData = [
  {
    state: true,
    settingsFrom: 'Baseline Rules',
    catagory: 'CAR Government Regulation',
    name: 'Night Duty',
    type: 'Definition',
    id: 1,
  },
  {
    state: false,
    settingsFrom: 'Flight Desk',
    catagory: 'CAR Government Regulation',
    name:
      'Split Duty Extension to Maximum FDP (Split Duty Extension to Maximum FDP)',
    type: 'Duty Time Limitation',
    id: 2,
  },
  {
    state: true,
    settingsFrom: 'Baseline Rules',
    catagory: 'CAR Government Regulation',
    name: 'Minimum Rest at Home Base (Minimum Rest at Home Base)',
    type: 'Rest RUle',
    id: 3,
  },
  {
    isEdited: true,
    state: false,
    settingsFrom: 'Widebody',
    catagory: 'OverSeas Cabin Contract',
    name: 'Earily Duty',
    type: 'Cost RUle',
    id: 4,
  },
  {
    state: true,
    settingsFrom: 'Baseline Rules',
    catagory: 'Basic Pairing Rules',
    name: 'Late Duty',
    type: 'Soft Rule',
    id: 5,
  },
];
