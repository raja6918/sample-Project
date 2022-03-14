import React from 'react';
import { shallow } from 'enzyme';

import { Base } from '../Base';

const fnCancel = jest.fn();
const fixture = {
  id: 'my-id',
  title: 'my-title',
};

test('Base Component renders', () => {
  const wrapper = shallow(
    <Base
      open={false}
      id={fixture.id}
      title={fixture.title}
      onClose={fnCancel}
      classes={{
        dialogPaper: {
          minHeight: '320px',
          maxHeight: '480px',
          width: '560px',
        },
      }}
    />
  );

  expect(wrapper.props()['aria-labelledby']).toBe(fixture.id);
  expect(
    wrapper
      .children()
      .at(0)
      .children()
      .text()
  ).toBe(fixture.title);

  wrapper
    .children()
    .at(1)
    .simulate('click');

  expect(fnCancel).toHaveBeenCalledTimes(1);
});
