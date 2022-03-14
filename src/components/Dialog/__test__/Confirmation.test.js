import React from 'react';
import { shallow } from 'enzyme';

import Confirmation from '../Confirmation';

const fnCancel = jest.fn();
const fnOk = jest.fn();
const fixture = {
  id: 'my-id',
  title: 'my-title',
  content: 'Content',
};

test('Confirmation Component renders', () => {
  const wrapper = shallow(
    <Confirmation
      open={false}
      id={fixture.id}
      title={fixture.title}
      handleCancel={fnCancel}
      modalCommand={true}
      handleOk={fnOk}
    >
      {fixture.content}
    </Confirmation>
  );

  expect(wrapper.props().disableBackdropClick).toBe(true);
  expect(wrapper.props().disableEscapeKeyDown).toBe(undefined);

  expect(
    wrapper
      .children()
      .at(0)
      .children()
      .text()
  ).toBe(fixture.content);

  wrapper
    .find('ActionsContent')
    .children()
    .at(0)
    .simulate('click');
  expect(fnCancel).toHaveBeenCalledTimes(1);
  wrapper
    .find('ActionsContent')
    .children()
    .at(1)
    .simulate('click');
  expect(fnOk).toHaveBeenCalledTimes(1);
});

test('Confirmation Component DialogActions buttons have correct text', () => {
  const wrapper = shallow(
    <Confirmation
      open={false}
      id={fixture.id}
      title={fixture.title}
      handleCancel={fnCancel}
      modalCommand={true}
      handleOk={fnOk}
    >
      {fixture.content}
    </Confirmation>
  );

  expect(
    wrapper
      .find('ActionsContent')
      .children()
      .at(0)
      .children()
      .text()
  ).toBe('Cancel');
  expect(
    wrapper
      .find('ActionsContent')
      .children()
      .at(1)
      .children()
      .text()
  ).toBe('Ok');
});

test('Confirmation Component DialogActions buttons have correct custom text', () => {
  const okButton = 'Test Ok';
  const cancelButton = 'Test Cancel';
  const wrapper = shallow(
    <Confirmation
      open={false}
      id={fixture.id}
      title={fixture.title}
      handleCancel={fnCancel}
      modalCommand={true}
      handleOk={fnOk}
      okButton={okButton}
      cancelButton={cancelButton}
    >
      {fixture.content}
    </Confirmation>
  );

  expect(
    wrapper
      .find('ActionsContent')
      .children()
      .at(0)
      .children()
      .text()
  ).toBe(cancelButton);
  expect(
    wrapper
      .find('ActionsContent')
      .children()
      .at(1)
      .children()
      .text()
  ).toBe(okButton);
});
