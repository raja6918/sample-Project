import React from 'react';
import { shallow } from 'enzyme';

import SelectWrapped from '../SelectWrapped';

const templateOptions = [
  { value: 1, label: 'Tempalte 1' },
  { value: 2, label: 'Tempalte 2' },
  { value: 3, label: 'Tempalte 3' },
];
const categoryOptions = [
  { value: 'Category 1', label: 'Category 1' },
  { value: 'Category 2', label: 'Category 2' },
  { value: 'Category 3', label: 'Category 3' },
];
test.skip('SelectWrapped component renders', () => {
  const wrapperRegular = shallow(
    <SelectWrapped
      createComponent={false}
      t={jest.fn()}
      instanceId={'sourceTemplate'}
      name={'sourceTemplate'}
      options={templateOptions}
      placeholder={'Source Template *'}
    />
  );

  expect(wrapperRegular).toMatchSnapshot();

  const wrapperCreate = shallow(
    <SelectWrapped
      createComponent={true}
      t={jest.fn()}
      instanceId={'category'}
      name={'category'}
      options={categoryOptions}
      placeholder={'Category'}
    />
  );

  expect(wrapperCreate).toMatchSnapshot();
});
