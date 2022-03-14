import { userReducer } from '../user';
import { USER } from '../../constants';
import { init } from 'i18next/dist/commonjs';

const initialState = {
  userData: {},
};
const userDetails = {
  firstName: 'Larry',
  lastName: 'Bertlemann',
  userName: 'rubberman',
  role: 'Planner',
  id: 14,
  email: 'rubberman@surf.com',
};

const updatedState = {
  userData: {
    firstName: 'Larry',
    lastName: 'Bertlemann',
    userName: 'rubberman',
    role: 'Planner',
    id: 14,
    email: 'rubberman@surf.com',
  },
};

describe(`Test suite related to user reducer`, () => {
  test(`Check when a user logged in , user details got updated as per`, () => {
    const newState = userReducer(initialState, {
      type: USER.SET_USER_DATA,
      payload: userDetails,
    });
    expect(newState.userData).toEqual(userDetails);
  });

  test(`Check whether the user data flushed out during situations like sign out`, () => {
    const newState = userReducer(updatedState, {
      type: USER.USER_DATA_CLEAN_UP,
    });

    expect(newState.userData).toEqual({});
  });
});
