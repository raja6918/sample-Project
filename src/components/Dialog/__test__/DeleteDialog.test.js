import React from 'react';
import { shallow } from 'enzyme';

import DeleteDialog from '../DeleteDialog';

test('DeleteDialog renders correct', () => {
  const userToDelete = {
    firstName: 'JOSE',
    lastName: 'Barraza',
  };
  const wrapper = shallow(
    <DeleteDialog
      open={false}
      handleCancel={jest.fn()}
      handleOk={jest.fn()}
      onExited={jest.fn()}
      title={'Delete user'}
      bodyText={'Are you sure?'}
      okText={'DELETE'}
      strongText={
        userToDelete
          ? `${userToDelete.firstName} ${userToDelete.lastName}?`
          : null
      }
      t={jest.fn()}
    />
  );

  expect(wrapper).toMatchSnapshot();
});
