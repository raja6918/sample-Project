import React from 'react';
import { shallow } from 'enzyme';
import { RuleSet } from '../RuleSet';

import * as ruleService from '../../../../../services/Data/rules';

const props = {
  t: jest.fn(() => 'Ruleset'),
  editMode: false,
  openItemId: '1',
  openItemName: 'Scenario test',
  handleDeleteError: jest.fn(),
  userData: { id: 1 },
};
const event = { currentTarget: 'test' };
let wrapper;
let testData;
describe('Rule set tests', () => {
  beforeEach(() => {
    testData = [
      {
        id: 1,
        object: 'ruleset',
        fallback: 2,
        name: 'base9-apply-bcd-10',
        description: null,
        lastModifiedDateTime: '2020-02-02T09:00',
        lastModifiedBy: 'yy',
      },
      {
        id: 2,
        object: 'ruleset',
        fallback: 0,
        name: 'base9-apply-bcd-10',
        description: null,
        lastModifiedDateTime: '2020-02-02T09:00',
        lastModifiedBy: 'yy',
      },
      {
        id: 3,
        object: 'ruleset',
        fallback: 1,
        name: 'Test-sample',
        description: null,
        lastModifiedDateTime: '2020-02-02T09:00',
        lastModifiedBy: 'yy',
      },
    ];
    ruleService.getAllRuleSets = jest.fn(() =>
      Promise.resolve(testData.slice(0, 2))
    );
    wrapper = shallow(<RuleSet {...props} />);
  });
  test('Ruleset component renders correct', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('Ruleset converter provides proper tree output', () => {
    const result = wrapper.instance().ruleSetConverter(testData);
    expect(result.children[0].id).toBe(1);
  });

  test('check confirmRuleSetDelete function works as expected', () => {
    wrapper.instance().confirmRuleSetDelete(testData[0], [0, 1]);
    expect(wrapper.state('deleteDialogIsOpen')).toBe(true);
    expect(wrapper.state('selectedRuleset').id).toBe(1);
    expect(wrapper.state('selectedNodePath')).toContain(1);
  });

  test('check closeDeleteDialog works as expected', () => {
    wrapper.instance().closeDeleteDialog();
    expect(wrapper.state('deleteDialogIsOpen')).toBe(false);
    expect(wrapper.state('selectedRuleset')).toBeNull();
    expect(wrapper.state('selectedNodePath').length).toBe(0);
  });

  test('check whether openMenu works as expected', () => {
    wrapper.instance().openMenu(event, 1);
    expect(wrapper.state('anchorEl')).toBe('test');
    expect(wrapper.state('currentNode')).toBe(1);
  });

  test('check whether openMenu works as expected when no values are passed', () => {
    wrapper.instance().openMenu();
    expect(wrapper.state('anchorEl')).toBeNull();
    expect(wrapper.state('currentNode')).toBeNull();
  });

  test('check whether closeMenu works as expected ', () => {
    wrapper.instance().closeMenu();
    expect(wrapper.state('anchorEl')).toBeNull();
    expect(wrapper.state('currentNode')).toBeNull();
  });

  test('check whether handleMenuClick works as expected', () => {
    wrapper.instance().handleMenuClick();
    expect(wrapper.state('isUpdating')).toBe(true);
  });

  test('check whether duplicate ruleset works as expected ', async () => {
    ruleService.addRuleSet = jest.fn(() => Promise.resolve(testData[2]));
    await wrapper.instance().duplicateCurrentNode(testData[0], [0, 1]);
    expect(wrapper.state('treeData')[0].children.length).toBe(2);
  });
  test('check whether add ruleset works as expected ', async () => {
    expect(wrapper.state('treeData')[0].children[0].children).toBeUndefined();
    ruleService.addRuleSet = jest.fn(() => Promise.resolve(testData[2]));
    await wrapper.instance().addNewNode(testData[1], [0, 1]);
    expect(wrapper.state('treeData')[0].children[0].children.length).toBe(1);
  });
  test('check whether the name is getting updated', () => {
    const e = { target: { value: 'test' } };
    wrapper.instance().handleChangeNewNode(e, testData[1], [0]);
    expect(wrapper.state('treeData')[0].name).toBe('test');
  });
  test('check whether the node details get update correctly ', async () => {
    const e = { target: { value: 'test', closest: jest.fn(() => null) } };
    testData[1].name = 'test';
    ruleService.updateRuleSet = jest.fn(() => Promise.resolve([testData[1]]));
    wrapper.instance().updateNodeName(e, testData[1], [0]);
    expect(wrapper.state('treeData')[0].name).toBe('test');
  });
  test('check whether the node details get update correctly for null values', async () => {
    wrapper.instance().setState({ selectedRuleset: testData[1] });
    const e = { target: { value: '', closest: jest.fn(() => null) } };
    ruleService.updateRuleSet = jest.fn(() => Promise.resolve([testData[1]]));
    wrapper.instance().updateNodeName(e, testData[1], [0]);
    expect(wrapper.state('treeData')[0].name).toBe('base9-apply-bcd-10');
  });

  let readOnlyWrapper;
  test('Ruleset component render correct in readOnly mode', () => {
    readOnlyWrapper = shallow(<RuleSet {...props} readOnly={true} />);
    expect(readOnlyWrapper).toMatchSnapshot();
  });
});
