/**
 * Do not remove this file content as it is used in unit tests
 */

export const treeData = [
  {
    title: 'Baseline Rules',
    expanded: true,
    subtitle: '',
    children: [
      {
        title: 'Flight Deck',
        subtitle: 'Last modified: 05-FEB 2020',
        expanded: false,
        children: [
          {
            title: 'Widebody',
            subtitle: 'Last modified: 05-FEB 2020',
          },
          {
            title: 'Narrowbody',
            subtitle: 'Last modified: 05-FEB 2020',
          },
          {
            title: 'Regional',
            subtitle: 'Last modified: 05-FEB 2020',
          },
        ],
      },
      {
        title: 'Cabin Crew',
        subtitle: 'Last modified: 05-FEB 2020',
      },
    ],
  },
];

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

export const currentRuleSet = {
  name: 'Test Ruleset',
  lastModifiedBy: 'Admin',
  lastModifiedDate: 'October 19, 2020 at 3:42 AM',
  description: '',
  status: '',
};

export const getDescriptionMockAPI = (data, ruleDescriptionData) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const ruleDescription = ruleDescriptionData.find(
        description => description.code === data.code
      );
      resolve(ruleDescription);
    }, 10);
  });
};

/**
 * Now act as mock API call. Will be removed once API is integrated.
 */
export const setParamMockAPI = value => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (parseFloat(value) === -1) {
        reject(value);
      } else if (value === '03:00') {
        reject(value);
      } else if (value === '2020-02-20') {
        reject(value);
      } else if (value === 'snack') {
        reject(value);
      }
      resolve(value);
    }, 10);
  });
};

export const ruleSets = [
  { id: 1, name: 'base9-apply-bcd-10', fallback: 2 },
  { id: 1000, name: '<ruleset for solverRequest 1>', fallback: 1 },
  { id: 2, name: 'widebody', fallback: 3 },
  { id: 3, name: 'baseline', fallback: 0 },
];

export const ruleDescriptionData = [
  {
    id: -22,
    object: 'ruleView',
    ruleset: 2,
    code: 'CiesApplyAllowDeadheadDuty',
    name: 'Allow deadhead duties at the start, middle, and/or end of a pairing',
    ruleTypeName: 'Pairing rule',
    ruleCategoryName: 'Basic pairing construction',
    ruleHasReject: true,
    active: false,
    activeDefinedInCurrent: false,
    activeReferenceRulesetName: 'root',
    settingsFromRulesetName: 'root',
    userDescription: {
      object: 'userDescriptionComponent',
      data:
        'Allow deadhead-only duties in a pairing at the beginning, middle or end of a pairing, according to the following selections.\n[SierraCiesApplyAllowDeadheadDuty0]() Allow deadhead-only duties at the beginning of a pairing.\n[SierraCiesApplyAllowDeadheadDuty1]() Allow deadhead-only duties anywhere in the middle of a pairing.\n[SierraCiesApplyAllowDeadheadDuty2]() Allow deadhead-only duties at the end of a pairing.\nNote: If you want to forbid a deadhead-only duty, remove that duty type from the [hyperlink0]().',
      references: [
        {
          object: 'userDescriptionParamItem',
          type: 'booleanParamType',
          paramType: { object: 'booleanParamType' },
          name: 'SierraCiesApplyAllowDeadheadDuty0',
          switch: true,
          value: 'true',
          description: '',
          definedInCurrent: false,
          referenceRulesetName: 'root',
        },
        {
          object: 'userDescriptionParamItem',
          type: 'booleanParamType',
          paramType: { object: 'booleanParamType' },
          name: 'SierraCiesApplyAllowDeadheadDuty1',
          switch: true,
          value: 'true',
          description: '',
          definedInCurrent: false,
          referenceRulesetName: 'root',
        },
        {
          object: 'userDescriptionParamItem',
          type: 'booleanParamType',
          paramType: { object: 'booleanParamType' },
          name: 'SierraCiesApplyAllowDeadheadDuty2',
          switch: true,
          value: 'true',
          description: '',
          definedInCurrent: false,
          referenceRulesetName: 'root',
        },
        {
          object: 'userDescriptionLinkItem',
          type: 'hyperlink',
          name: 'hyperlink0',
          value: 'Duty Composition rule',
          code: 'CiesApplyDutyComposition',
        },
      ],
    },
  },
  {
    id: 2,
    code: 'duty-duration-max',
    name: 'Night Duty',
    ruleset: 1,
    active: false,
    activeDefinedInCurrent: false,
    userDescription: [
      {
        type: 'text',
        value: 'means a duty period between ',
      },
      {
        type: 'timeParamType',
        value: '02:00',
        min: '00:00',
        max: '04:00',
        name: 'minTripDsssutiesNb',
        definedInCurrent: false,
        referenceRulesetName: 'Baseline',
      },
      { type: 'text', value: ' and ' },
      {
        type: 'timeParamType',
        value: '04:59',
        min: '00:00',
        max: '05:00',
        name: 'maxTripDsssutiesNb',
        definedInCurrent: false,
        referenceRulesetName: 'Baseline',
      },
      { type: 'text', value: ' the time zone to which the crew is ' },
      { type: 'hyperlink', value: 'acclimatised.', code: 'acclimatised' },
    ],
  },
  {
    id: 3,
    code: 'leg-nb-max',
    name: 'Acclimatised',
    ruleset: 1,
    userDescription: [
      {
        type: 'text',
        value:
          'means a state in which a crew member’s circadian biological clock is synchronised to the time zone where the crew member is. A crew member is considered to ',
      },
      {
        type: 'durationParamType',
        value: '2h15',
        min: '0h00',
        max: '12h00',
        name: 'durRation',
        definedInCurrent: false,
        referenceRulesetName: 'Baseline',
      },
      {
        type: 'text',
        value:
          ' wide time zone surrounding the local time at the point of departure. When the local time at the place where a duty commences differs by more than 2 hours from the local time at the place where the next duty starts, the crew member, for the calculation of the maximum daily flight duty period, is considered to be acclimati-sed in accordance with the values in the Table 1.',
      },
    ],
  },
  {
    id: 4,
    code: 'lg-nt',
    name: "Local night's rest",
    ruleset: 1,
    userDescription: [
      {
        type: 'text',
        value:
          'Some mock description about local night rest. Also testing enumParamType ',
      },
      {
        type: 'enumParamType',
        name: 'mealType',
        value: 'lunch',
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        description: 'meal type',
        definedInCurrent: false,
        referenceRulesetName: 'baseline',
      },
      {
        type: 'text',
        value: ' and booleanParamType ',
      },
      {
        type: 'booleanParamType',
        paramType: 15,
        name: 'legNbIncludesDhs',
        value: 'true',
        values: [
          {
            value: true,
            display: 'included',
          },
          {
            value: false,
            display: 'excluded',
          },
        ],
        description: 'includes dhds',
        definedInCurrent: false,
        referenceRulesetName: 'baseline',
      },
      {
        type: 'text',
        value:
          ' and testing list items in newline, \n      ● générale list one. \n      ● list two 10 €.',
      },
    ],
  },
  {
    id: 5,
    code: 'duty-credit-max',
    name: 'Early duty',
    ruleset: 1,
    userDescription: [
      {
        type: 'text',
        value: 'Some mock description. Also testing decimalParamType ',
      },
      {
        type: 'decimalParamType',
        value: '12.12',
        name: 'minEarlyDty',
        description: 'minimum early duty',
        definedInCurrent: true,
        referenceRulesetName: 'Baseline',
      },
    ],
  },
  {
    id: 6,
    code: 'duty-credit',
    name: 'Early duty',
    ruleset: 1,
    userDescription: [
      {
        type: 'text',
        value:
          'Some mock description about early duty. Also testing decimalParamType ',
      },
      {
        type: 'decimalParamType',
        value: '12.12',
        name: 'minEarlyDty',
        description: 'minimum early duty',
        definedInCurrent: true,
        referenceRulesetName: 'Baseline',
      },
    ],
  },
  {
    id: 7,
    code: 'cost',
    name: 'cost',
    userDescription: [
      {
        type: 'text',
        value: 'Some mock description about Late. Also testing dateParamType ',
      },
      {
        type: 'dateParamType',
        value: '2020-02-18',
        min: '1950-01-01',
        max: '3000-01-01',
        name: 'testDateParam',
        definedInCurrent: false,
        referenceRulesetName: 'Baseline',
      },
    ],
  },
  {
    id: 8,
    code: 'leg-nb',
    name: 'cost',
    ruleset: 1,
    userDescription: [
      {
        type: 'text',
        value: 'Some mock description about Late. Also testing dateParamType ',
      },
      {
        type: 'dateParamType',
        value: '2020-02-18',
        min: '1950-01-01',
        max: '3000-01-01',
        name: 'testDateParam',
        definedInCurrent: false,
        referenceRulesetName: 'Baseline',
      },
    ],
  },
];

export const rulesData = [
  {
    active: false,
    settingsFromRulesetName: 'baseline',
    category: 'CAR Government Regulation',
    name: 'Night Duty',
    type: 'Definition',
    id: 1,
    activeDefinedInCurrent: false,
    activeReferenceRulesetName: 'widebody',
    code: 'CiesApplyAllowDeadheadDuty',
  },
  {
    active: true,
    settingsFromRulesetName: 'Flight Desk',
    category: 'CAR Government Regulation',
    name:
      'Split Duty Extension to Maximum FDP (Split Duty Extension to Maximum FDP)',
    type: 'Duty Time Limitation',
    id: 2,
    activeDefinedInCurrent: true,
    activeReferenceRulesetName: 'widebody',
    code: 'duty-duration-max',
  },
  {
    active: true,
    settingsFromRulesetName: 'Baseline Rules',
    category: 'CAR Government Regulation',
    name: 'Minimum Rest at Home Base (Minimum Rest at Home Base)',
    type: 'Rest Rule',
    id: 3,
    activeDefinedInCurrent: true,
    activeReferenceRulesetName: 'Baseline Rules',
    code: 'duty-nb-max-2',
  },
  {
    isEdited: true,
    active: false,
    settingsFromRulesetName: 'Widebody',
    category: 'OverSeas Cabin Contract',
    name: 'Early Duty',
    type: 'Cost Rule',
    id: 4,
    activeDefinedInCurrent: false,
    activeReferenceRulesetName: 'widebody',
    code: 'duty-nb-max-3',
  },
  {
    active: true,
    settingsFromRulesetName: 'Baseline Rules',
    category: 'Basic Pairing Rules',
    name: 'Late Duty',
    type: 'Soft Rule',
    id: 5,
    activeDefinedInCurrent: true,
    activeReferenceRulesetName: 'Baseline Rules',
    code: 'duty-nb-max-4',
  },
  {
    active: true,
    settingsFromRulesetName: 'Baseline Rules',
    category: 'CAR Government Regulation',
    name: 'Night Duty',
    type: 'Definition',
    id: 11,
    activeDefinedInCurrent: true,
    activeReferenceRulesetName: 'Baseline Rules',
    code: 'duty-nb-max-5',
  },
  {
    active: false,
    settingsFromRulesetName: 'Flight Desk',
    category: 'CAR Government Regulation',
    name: 'Split Duty Extension to Maximum FDP',
    type: 'Duty Time Limitation',
    id: 12,
    activeDefinedInCurrent: false,
    activeReferenceRulesetName: 'widebody',
    code: 'duty-nb-max-6',
  },
  {
    active: true,
    settingsFromRulesetName: 'Baseline Rules',
    category: 'CAR Government Regulation',
    name: 'Minimum Rest at Home Base',
    type: 'Rest Rule',
    id: 13,
    activeDefinedInCurrent: false,
    activeReferenceRulesetName: 'widebody',
    code: 'duty-nb-max-7',
  },
  {
    isEdited: true,
    active: false,
    settingsFromRulesetName: 'Widebody',
    category: 'OverSeas Cabin Contract',
    name: 'Early Duty',
    type: 'Cost Rule',
    id: 14,
    activeDefinedInCurrent: false,
    activeReferenceRulesetName: 'widebody',
    code: 'duty-nb-max-8',
  },
  {
    active: true,
    settingsFromRulesetName: 'Baseline Rules',
    category: 'Basic Pairing Rules',
    name: 'Late Duty',
    type: 'Soft Rule',
    id: 15,
    activeDefinedInCurrent: false,
    activeReferenceRulesetName: 'widebody',
    code: 'duty-nb-max-9',
  },
  {
    active: true,
    settingsFromRulesetName: 'Baseline Rules',
    category: 'CAR Government Regulation',
    name: 'Night Duty',
    type: 'Definition',
    id: 21,
    activeDefinedInCurrent: false,
    activeReferenceRulesetName: 'widebody',
    code: 'duty-nb-max-10',
  },
  {
    active: false,
    settingsFromRulesetName: 'Flight Desk',
    category: 'CAR Government Regulation',
    name: 'Split Duty Extension to Maximum FDP',
    type: 'Duty Time Limitation',
    id: 22,
    activeDefinedInCurrent: false,
    activeReferenceRulesetName: 'widebody',
    code: 'duty-nb-max-11',
  },
  {
    active: true,
    settingsFromRulesetName: 'Baseline Rules',
    category: 'CAR Government Regulation',
    name: 'Minimum Rest at Home Base',
    type: 'Rest Rule',
    id: 23,
    activeDefinedInCurrent: false,
    activeReferenceRulesetName: 'widebody',
    code: 'duty-nb-max-12',
  },
  {
    isEdited: true,
    active: false,
    settingsFromRulesetName: 'Widebody',
    category: 'OverSeas Cabin Contract',
    name: 'Early Duty',
    type: 'Cost Rule',
    id: 24,
    activeDefinedInCurrent: false,
    activeReferenceRulesetName: 'widebody',
    code: 'duty-nb-max-13',
  },
  {
    active: true,
    settingsFromRulesetName: 'Baseline Rules',
    category: 'Basic Pairing Rules',
    name: 'Late Duty',
    type: 'Soft Rule',
    id: 25,
    activeDefinedInCurrent: false,
    activeReferenceRulesetName: 'widebody',
    code: 'duty-nb-max-14',
  },
];

export const dutyDurationMockResponse = {
  active: false,
  activeDefinedInCurrent: false,
  activeReferenceRulesetName: 'baseline',
  code: 'duty-duration-def',
  id: -12,
  name: 'Duty duration definition',
  object: 'ruleView',
  ruleCategoryName: 'Basic',
  ruleHasReject: false,
  ruleTypeName: 'Definition',
  ruleset: 1,
  settingsFromRulesetName: null,
  userDescription: {
    object: 'userDescriptionComponent',
    data: `There are 7 types of rule tables. They are,
    1. **Simple Fixed Table** - To render fixed row and column table. There will be only one column with parameter (values). Eg [CiesConnTimeMinForNthAcChange]() and [CiesConnTimeMinForNthAcChange6]()
    2. **Fixed Table** - To render fixed row and column table. There will be multiple columns with parameters (values). Eg  [CiesConnTimeMinForNthAcChange1]() and [CiesConnTimeMinForNthAcChange5]() 
    3. **Simple Fixed Column Table** - To render table with fixed columns and variable rows. There will be only one column with parameter (values). Eg [CiesConnTimeMinForNthAcChange3]()
    4. **Fixed Column Table**- To render table with fixed columns and variable rows. There will be multiple columns with parameters (values). Eg  [CiesConnTimeMinForNthAcChange2]() and [CiesConnTimeMinForNthAcChange4]() and [CiesConnTimeMinForNthAcChange10]()
    5. **Simple List Table** - To render list table with one parameter. In simple list table the order is important. So return type will be an array. Eg [CiesConnTimeMinForNthAcChange7]()
    6. **List Table** - To render list table with more than one parameters. In list table the order is important. So return type will be an array of hashmaps. Eg [CiesConnTimeMinForNthAcChange8]()
    7. **Variable Column Fixed Type Table** - To render table with variable columns and variable rows. The columns will be of one param type. There will be multiple columns with parameters (values). Eg [CiesConnTimeMinForNthAcChange9]()
    8. **Fixed Multi dimensional Table** - To render table with fixed columns and rows. There will be an extra sidepanel with general and exceptions Eg [CiesConnTimeMinForNthAcChange11]()`,
    references: [
      {
        object: 'userDescriptionParamItem',
        type: 'tableParamType',
        paramType: 1,
        name: 'CiesConnTimeMinForNthAcChange',
        displayValue: 'table 1',
        description: '',
        definedInCurrent: false,
        referenceRulesetName: 'baseline',
      },
      {
        object: 'userDescriptionParamItem',
        type: 'tableParamType',
        paramType: 1,
        name: 'CiesConnTimeMinForNthAcChange1',
        displayValue: 'table 3',
        description: '',
        definedInCurrent: false,
        referenceRulesetName: 'baseline',
      },
      {
        object: 'userDescriptionParamItem',
        type: 'tableParamType',
        paramType: 1,
        name: 'CiesConnTimeMinForNthAcChange2',
        displayValue: 'table 6',
        description: '',
        definedInCurrent: false,
        referenceRulesetName: 'baseline',
      },
      {
        object: 'userDescriptionParamItem',
        type: 'tableParamType',
        paramType: 1,
        name: 'CiesConnTimeMinForNthAcChange3',
        displayValue: 'table 5',
        description: '',
        definedInCurrent: false,
        referenceRulesetName: 'baseline',
      },
      {
        object: 'userDescriptionParamItem',
        type: 'tableParamType',
        paramType: 1,
        name: 'CiesConnTimeMinForNthAcChange4',
        displayValue: 'table 7',
        description: '',
        definedInCurrent: false,
        referenceRulesetName: 'baseline',
      },
      {
        object: 'userDescriptionParamItem',
        type: 'tableParamType',
        paramType: 1,
        name: 'CiesConnTimeMinForNthAcChange5',
        displayValue: 'table 4',
        description: '',
        definedInCurrent: false,
        referenceRulesetName: 'baseline',
      },
      {
        object: 'userDescriptionParamItem',
        type: 'tableParamType',
        paramType: 1,
        name: 'CiesConnTimeMinForNthAcChange6',
        displayValue: 'table 2',
        description: '',
        definedInCurrent: false,
        referenceRulesetName: 'baseline',
      },
      {
        object: 'userDescriptionParamItem',
        type: 'tableParamType',
        paramType: 1,
        name: 'CiesConnTimeMinForNthAcChange7',
        displayValue: 'table 9',
        description: '',
        definedInCurrent: false,
        referenceRulesetName: 'baseline',
      },
      {
        object: 'userDescriptionParamItem',
        type: 'tableParamType',
        paramType: 1,
        name: 'CiesConnTimeMinForNthAcChange8',
        displayValue: 'table 10',
        description: '',
        definedInCurrent: false,
        referenceRulesetName: 'baseline',
      },
      {
        object: 'userDescriptionParamItem',
        type: 'tableParamType',
        paramType: 1,
        name: 'CiesConnTimeMinForNthAcChange9',
        displayValue: 'table 11',
        description: '',
        definedInCurrent: false,
        referenceRulesetName: 'baseline',
      },
      {
        object: 'userDescriptionParamItem',
        type: 'tableParamType',
        paramType: 1,
        name: 'CiesConnTimeMinForNthAcChange10',
        displayValue: 'table 8',
        description: '',
        definedInCurrent: false,
        referenceRulesetName: 'baseline',
      },
      {
        object: 'userDescriptionParamItem',
        type: 'tableParamType',
        paramType: 1,
        name: 'CiesConnTimeMinForNthAcChange11',
        displayValue: 'table 12',
        description: '',
        definedInCurrent: false,
        referenceRulesetName: 'baseline',
      },
    ],
  },
};

const fixedTableResponse1 = {
  type: 'fixedSimple',
  code: 'FDPmaxBuffer',
  title: 'FDP max buffer soft non linear penalty',
  header: [
    {
      field: 'columnLabel',
      displayName: 'Column label',
      type: 'title',
      displayOnly: true,
    },
    {
      field: 'buffer',
      displayName: 'Buffer',
      type: 'decimalParamType',
      rules: {
        min: 1,
        max: 100,
      },
    },
  ],
  data: [
    {
      code: 'cost',
      columnLabel: 'Cost (1k)',
      buffer: 10.0,
    },
    {
      code: 'factor',
      columnLabel: 'Factor',
      buffer: 1.2,
    },
    {
      code: 'rowLabel1',
      columnLabel: 'Row Label 1',
      buffer: 3.2,
    },
    {
      code: 'rowLabel2',
      columnLabel: 'Row Label 2',
      buffer: 5.0,
    },
    {
      code: 'rowLabel3',
      columnLabel: 'Row Label 3',
      buffer: 2.6,
    },
  ],
};

const fixedTableResponse2 = {
  type: 'fixed',
  code: 'FDPin24h',
  title: 'FDP in 24 hours max',
  header: [
    {
      field: 'columnLabel',
      displayName: 'Crew comp and rest accomodation',
      type: 'title',
      displayOnly: true,
    },
    {
      field: 'fdpDom',
      displayName: 'FDP dom',
      type: 'durationParamType',
      rules: {
        min: '00h00',
        max: '24h00',
      },
    },
    {
      field: 'fdpInt',
      displayName: 'FDP int',
      type: 'durationParamType',
      rules: {
        min: '00h00',
        max: '24h00',
      },
    },
  ],
  data: [
    {
      code: 'basicCrew',
      columnLabel: 'Basic crew',
      fdpDom: '13h00',
      fdpInt: '13h00',
    },
    {
      code: 'basicCrew1WithOutBunk',
      columnLabel: 'Basic crew + 1, without Bunk',
      fdpDom: '13h00',
      fdpInt: '13h00',
    },
    {
      code: 'basicCrew1WithBunk',
      columnLabel: 'Basic crew + 1, with Bunk',
      fdpDom: '13h00',
      fdpInt: '13h00',
    },
    {
      code: 'basicCrew2WithOutBunk',
      columnLabel: 'Basic crew + 2, without Bunk',
      fdpDom: '13h00',
      fdpInt: '13h00',
    },
    {
      code: 'basicCrew2WithBunk',
      columnLabel: 'Basic crew + 2, with Bunk',
      fdpDom: '13h00',
      fdpInt: '13h00',
    },
  ],
};

const fixedTableResponse3 = {
  type: 'fixed',
  code: 'CieMealFirstDay',
  title: 'First day meal (whatever that means)',
  columnHeader: 'Meal',
  rowHeader: 'Check-in type',
  header: [
    {
      field: 'columnLabel',
      displayName: 'Column label',
      type: 'title', // New component to render bold text
      displayOnly: true,
    }, // new displayOnly attribute to identify whether we need return this column values with save response
    {
      field: 'bfst',
      displayName: 'Breakfast',
      type: 'switchParamType',
    },
    {
      field: 'lnch',
      displayName: 'Lunch',
      type: 'switchParamType',
    },
    {
      field: 'dinner',
      displayName: 'Dinner',
      type: 'switchParamType',
    },
    {
      field: 'incid',
      displayName: 'Incidentals',
      type: 'switchParamType',
    },
    {
      field: 'snack',
      displayName: 'Snack',
      type: 'switchParamType',
    },
    {
      field: 'tip',
      displayName: 'Tip',
      type: 'switchParamType',
    },
  ],
  data: [
    {
      code: 'early',
      columnLabel: 'Early',
      bfst: false,
      lnch: true,
      dinner: true,
      incid: true,
      snack: false,
      tip: false,
    },
    {
      code: 'late',
      columnLabel: 'Late',
      bfst: false,
      lnch: false,
      dinner: true,
      incid: true,
      snack: false,
      tip: false,
    },
  ],
};

const fixedTableResponse4 = {
  type: 'fixedSimple',
  code: 'MaxDutyTypesPerPairing',
  title: 'Maximum early/late duties per pairing',
  // columnHeader: 'Maximum',  <- redundant with field displayName
  rowHeader: 'Check-in type',
  header: [
    {
      field: 'columnLabel',
      displayName: 'Column label',
      type: 'title', // New component to render bold text
      displayOnly: true, // new displayOnly attribute to identify whether we need return this column values with save response
    },
    {
      field: 'single',
      displayName: 'Maximum',
      type: 'integerParamType',
    },
  ],
  data: [
    { code: 'early', columnLabel: 'Early', single: 3 },
    { code: 'late', columnLabel: 'Late', single: 2 },
  ],
};

const fixedColumnTableResponse1 = {
  type: 'fixedColumn',
  code: 'Intlperdiem',
  title: 'Intl per diem cost per station',
  header: [
    {
      field: 'station',
      displayName: 'Station',
      isKey: true,
      enumType: 'station',
      type: 'dynamicEnumParamType',
    },
    {
      field: 'currency',
      displayName: 'Currency',
      enumType: 'currency',
      type: 'dynamicEnumParamType',
    },
    {
      field: 'perDiem',
      displayName: 'Per diem',
      type: 'decimalParamType',
      rules: {
        min: 1,
        max: 100,
      },
    },
  ],
  data: [
    {
      station: 'JFK',
      currency: 'USD',
      perDiem: 66.6,
    },
    {
      station: 'BOS',
      currency: 'USD',
      perDiem: 56.8,
    },
    {
      station: 'LAX',
      currency: 'USD',
      perDiem: 63.4,
    },
    {
      station: 'SFO',
      currency: 'USD',
      perDiem: 65.1,
    },
    {
      station: 'SAN',
      currency: 'USD',
      perDiem: 56.9,
    },
    {
      station: 'YZP',
      currency: 'USD',
      perDiem: 56.4,
    },
  ],
};

const fixedColumnTableResponse2 = {
  type: 'fixedColumnSimple',
  code: 'CieTripDurationPenalty',
  title: 'Pairing penalty by leg count',
  // columnHeader: 'Maximum',  <- redundant with field displayName
  rowHeader: 'Check-in type',
  header: [
    {
      field: 'columnLabel',
      displayName: 'Column label',
      type: 'integerParamType',
      isKey: true,
    },
    {
      field: 'single',
      displayName: 'Penalty',
      type: 'decimalParamType',
      rules: {
        min: 1,
        max: 100,
      },
    },
  ],
  data: [
    { columnLabel: 0, single: 0.0 },
    { columnLabel: 3, single: 20.2 },
    { columnLabel: 5, single: 50.0 },
  ],
};

const fixedColumnTableResponse3 = {
  type: 'fixedColumn',
  code: 'CieMealLastDay',
  title: 'Last day meal (whatever that means) by start time',
  columnHeader: 'Meal',
  rowHeader: 'Check-in time',
  header: [
    {
      field: 'columnLabel',
      displayName: 'Column label',
      type: 'timeParamType',
      isKey: true,
    },
    {
      field: 'bfst',
      displayName: 'Breakfast',
      type: 'switchParamType',
    },
    {
      field: 'lnch',
      displayName: 'Lunch',
      type: 'switchParamType',
    },
    {
      field: 'dinner',
      displayName: 'Dinner',
      type: 'switchParamType',
    },
    {
      field: 'incid',
      displayName: 'Incidentals',
      type: 'switchParamType',
    },
    {
      field: 'snack',
      displayName: 'Snack',
      type: 'switchParamType',
    },
    {
      field: 'tip',
      displayName: 'Tip',
      type: 'switchParamType',
    },
  ],
  data: [
    {
      columnLabel: '00:00',
      bfst: false,
      lnch: true,
      dinner: true,
      incid: true,
      snack: false,
      tip: false,
    },
    {
      columnLabel: '12:00',
      bfst: false,
      lnch: false,
      dinner: true,
      incid: true,
      snack: false,
      tip: false,
    },
  ],
};

const fixedColumnTableResponse4 = {
  type: 'fixedColumn',
  code: 'CieMealLastDay',
  title: 'Last day meal (whatever that means) by start date',
  columnHeader: 'Meal',
  rowHeader: 'Check-in date',
  header: [
    {
      field: 'columnLabel',
      displayName: 'Column label',
      type: 'dateParamType',
      isKey: true,
    },
    {
      field: 'bfst',
      displayName: 'Breakfast',
      type: 'switchParamType',
    },
    {
      field: 'lnch',
      displayName: 'Lunch',
      type: 'switchParamType',
    },
    {
      field: 'dinner',
      displayName: 'Dinner',
      type: 'switchParamType',
    },
    {
      field: 'incid',
      displayName: 'Incidentals',
      type: 'switchParamType',
    },
    {
      field: 'snack',
      displayName: 'Snack',
      type: 'switchParamType',
    },
    {
      field: 'tip',
      displayName: 'Tip',
      type: 'switchParamType',
    },
  ],
  data: [
    {
      columnLabel: '2021-08-01',
      bfst: false,
      lnch: true,
      dinner: true,
      incid: true,
      snack: false,
      tip: false,
    },
    {
      columnLabel: '2021-08-05',
      bfst: false,
      lnch: false,
      dinner: true,
      incid: true,
      snack: false,
      tip: false,
    },
  ],
};

const simpleList = {
  type: 'simpleList',
  code: 'FDPmax',
  title: 'FDP max buffer soft non linear penalty',
  header: [
    {
      field: 'diemType',
      displayName: 'Per diem type',
      type: 'enumParamType',
      enum: ['DOM', 'MCA', 'INT', 'PAC'],
    },
  ],
  data: [
    { diemType: 'DOM' },
    { diemType: 'MCA' },
    { diemType: 'INT' },
    { diemType: 'PAC' },
    { diemType: 'DOM' },
    { diemType: 'INT' },
  ],
};

const list = {
  type: 'list',
  code: 'FDPmaxBuffer',
  title: 'FDP max buffer soft non linear penalty',
  header: [
    {
      field: 'diemType',
      displayName: 'Per diem type',
      type: 'enumParamType',
      enum: ['DOM', 'MCA', 'INT', 'PAC', 'HUX'],
    },
    {
      field: 'station1',
      displayName: 'In Station',
      enumType: 'station',
      type: 'dynamicEnumParamType',
    },
    {
      field: 'station2',
      displayName: 'Out Station',
      enumType: 'station',
      type: 'dynamicEnumParamType',
    },
  ],
  data: [
    { diemType: 'DOM', station1: 'JFK', station2: 'BOS' },
    { diemType: 'MCA', station1: 'LAX', station2: 'SFO' },
    { diemType: 'INT', station1: 'SAN', station2: 'JFK' },
    { diemType: 'PAC', station1: 'LAX', station2: 'SFO' },
    { diemType: 'DOM', station1: 'JFK', station2: 'BOS' },
  ],
};

const variableColumnFixedType = {
  type: 'variableColumnFixedType',
  code: 'DutyMaxPerLandingsAndTime',
  title: 'Maximum duty time per landings and duty start time',
  columnHeader: 'FDP departure time',
  rowHeader: 'Number of landings',
  defaultHeaderType: 'integerParamType',
  defaultHeaderRules: {
    min: '1',
    max: '10',
  },
  defaultBodyType: 'durationParamType',
  defaultBodyRules: {
    min: '00h00',
    max: '24h00',
  },
  defaultHeaderPlaceholder: 'Landings',
  defaultBodyPlaceholder: 'Duration',
  enableSort: false,
  header: [
    {
      field: 'columnLabel',
      displayName: '',
      type: 'timeRangeParamType',
      isKey: true,
      columnHeader: true, //  to render grey background
      enableSort: false,
    },
    {
      field: '1',
      value: 1,
      type: 'durationParamType',
      enableSort: false,
    },
    {
      field: '2',
      value: 2,
      type: 'durationParamType',
      enableSort: false,
    },
    {
      field: '3',
      value: 3,
      type: 'durationParamType',
      enableSort: false,
    },
    {
      field: '4',
      value: 4,
      type: 'durationParamType',
      enableSort: false,
    },
    {
      field: '6',
      value: 6,
      type: 'durationParamType',
      enableSort: false,
    },
  ],
  data: [
    {
      columnLabel: '00:00',
      '1': '12h00',
      '2': '10h00',
      '3': '12h00',
      '4': '4h11',
      '6': '6h11',
    },
    {
      columnLabel: '05:00',
      '1': '13h00',
      '2': '11h00',
      '3': '1h00',
      '4': '4h22',
      '6': '6h22',
    },
    {
      columnLabel: '10:00',
      '1': '12h30',
      '2': '10h30',
      '3': '12h30',
      '4': '4h33',
      '6': '6h33',
    },
    {
      columnLabel: '12:00',
      '1': '12h44',
      '2': '10h44',
      '3': '12h45',
      '4': '4h44',
      '6': '6h44',
    },
  ],
};

const fixedMultiDimensional = {
  type: 'fixedMuliDimensional',
  code: 'CieMealFirstDay',
  title: 'Crew connection times',
  columnHeader: 'Inbound',
  rowHeader: 'Outbound',
  exceptions: [
    {
      key: 'region',
      placeholder: 'Region',
      values: {
        CAN: {
          LiveInt: { QkDom: '16h00' },
          QkInt: { CmlInt: '18h00' },
          CmlInt: { LiveDom: '17h00' },
        },
        SAM: {
          LiveDom: { LiveDom: '0h45', CmlInt: '0h45' },
        },
      },
    },
    {
      key: 'station',
      placeholder: 'Station',
      values: {
        YUL: {
          LiveInt: { CmlDom: '19h00' },
          QkInt: { LiveInt: '20h00' },
          CmlInt: { Gnd: '21h00', LiveDom: '22h00' },
        },
        YFC: {
          QkInt: { LiveInt: '18h00' },
        },
        YVR: {
          CmlInt: { Gnd: '16h00' },
        },
      },
    },
  ],
  header: [
    {
      field: 'columnLabel',
      displayName: ' ',
      type: 'title', // to render labels in bold
      displayOnly: true, // If true then we will not pass this in return
      columnHeader: true, //  to render grey background
      enableSort: false,
    },
    {
      field: 'LiveDom',
      displayName: 'Live Dom',
      type: 'durationParamType',
      enableSort: false,
    },
    {
      field: 'LiveInt',
      displayName: 'Live Int',
      type: 'durationParamType',
      enableSort: false,
    },
    {
      field: 'QkDom',
      displayName: 'QK Dom',
      type: 'durationParamType',
      enableSort: false,
    },
    {
      field: 'QkInt',
      displayName: 'QK Int',
      type: 'durationParamType',
      enableSort: false,
    },
    {
      field: 'CmlDom',
      displayName: 'CML Dom',
      type: 'durationParamType',
      enableSort: false,
    },
    {
      field: 'CmlInt',
      displayName: 'CML Int',
      type: 'durationParamType',
      enableSort: false,
    },
    {
      field: 'Gnd',
      displayName: 'GND DHD',
      type: 'durationParamType',
      enableSort: false,
    },
  ],
  data: [
    {
      code: 'LiveDom',
      columnLabel: 'Live Dom',
      LiveDom: '15h00',
      LiveInt: '15h00',
      QkDom: '15h00',
      QkInt: '15h00',
      CmlDom: '15h00',
      CmlInt: '15h00',
      Gnd: '15h00',
    },
    {
      code: 'LiveInt',
      columnLabel: 'Live Int',
      LiveDom: '15h00',
      LiveInt: '15h00',
      QkDom: '15h00',
      QkInt: '15h00',
      CmlDom: '15h00',
      CmlInt: '15h00',
      Gnd: '15h00',
    },
    {
      code: 'QkDom',
      columnLabel: 'QK Dom',
      LiveDom: '15h00',
      LiveInt: '15h00',
      QkDom: '15h00',
      QkInt: '15h00',
      CmlDom: '15h00',
      CmlInt: '15h00',
      Gnd: '15h00',
    },
    {
      code: 'QkInt',
      columnLabel: 'QK Int',
      LiveDom: '15h00',
      LiveInt: '15h00',
      QkDom: '15h00',
      QkInt: '15h00',
      CmlDom: '15h00',
      CmlInt: '15h00',
      Gnd: '15h00',
    },
    {
      code: 'CmlDom',
      columnLabel: 'CML Dom',
      LiveDom: '15h00',
      LiveInt: '15h00',
      QkDom: '15h00',
      QkInt: '15h00',
      CmlDom: '15h00',
      CmlInt: '15h00',
      Gnd: '15h00',
    },
    {
      code: 'CmlInt',
      columnLabel: 'CML Int',
      LiveDom: '15h00',
      LiveInt: '15h00',
      QkDom: '15h00',
      QkInt: '15h00',
      CmlDom: '15h00',
      CmlInt: '15h00',
      Gnd: '15h00',
    },
    {
      code: 'Gnd',
      columnLabel: 'GND DHD',
      LiveDom: '15h00',
      LiveInt: '15h00',
      QkDom: '15h00',
      QkInt: '15h00',
      CmlDom: '15h00',
      CmlInt: '15h00',
      Gnd: '15h00',
    },
  ],
};

/**
 * Now act as mock API call. Will be removed once API is integrated.
 */
export const getTableData = code => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (code === 'CiesConnTimeMinForNthAcChange') {
        resolve(fixedTableResponse1);
      }
      if (code === 'CiesConnTimeMinForNthAcChange1') {
        resolve(fixedTableResponse2);
      }
      if (code === 'CiesConnTimeMinForNthAcChange2') {
        resolve(fixedColumnTableResponse1);
      }
      if (code === 'CiesConnTimeMinForNthAcChange3') {
        resolve(fixedColumnTableResponse2);
      }
      if (code === 'CiesConnTimeMinForNthAcChange4') {
        resolve(fixedColumnTableResponse3);
      }
      if (code === 'CiesConnTimeMinForNthAcChange5') {
        resolve(fixedTableResponse3);
      }
      if (code === 'CiesConnTimeMinForNthAcChange6') {
        resolve(fixedTableResponse4);
      }
      if (code === 'CiesConnTimeMinForNthAcChange7') {
        resolve(simpleList);
      }
      if (code === 'CiesConnTimeMinForNthAcChange8') {
        resolve(list);
      }
      if (code === 'CiesConnTimeMinForNthAcChange9') {
        resolve(variableColumnFixedType);
      }
      if (code === 'CiesConnTimeMinForNthAcChange10') {
        resolve(fixedColumnTableResponse4);
      }
      if (code === 'CiesConnTimeMinForNthAcChange11') {
        resolve(fixedMultiDimensional);
      }
    }, 1000);
  });
};
