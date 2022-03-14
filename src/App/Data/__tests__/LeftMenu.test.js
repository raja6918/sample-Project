import React from 'react';
import { shallow } from 'enzyme';

import LeftMenu, {
  Container,
  ExpandCollapseButton,
  ListItemMU,
  MenuItem,
} from '../LeftMenu';

import { getRoutes } from '../leftMenuConstants';

const t = jest.fn();
const options = getRoutes(t);
const current_path = '/data/1040';

test('Leftmenu componente render corrects', () => {
  expect(
    shallow(
      <LeftMenu
        t={t}
        current_path={current_path}
        location={'/data/1040/stations'}
        scenarioId={1040}
        scenarioName={'Scenario Test'}
        open={true}
        handleExpandCollapseMenu={jest.fn()}
        openItemId={'1'}
        openItemName={'Test Scenario'}
        editMode={false}
        options={options}
        name={'Test name'}
      />
    )
  ).toMatchSnapshot();

  expect(shallow(<Container open={true} />)).toMatchSnapshot();
  expect(shallow(<Container open={false} />)).toMatchSnapshot();
  expect(shallow(<ExpandCollapseButton open={true} />)).toMatchSnapshot();
  expect(shallow(<ExpandCollapseButton open={false} />)).toMatchSnapshot();
  expect(shallow(<ListItemMU hovercolor={'#ff0000'} />)).toMatchSnapshot();
  expect(
    shallow(
      <MenuItem
        link={`${current_path}/aircraft`}
        icon="airplanemode_active"
        name={'Aircraft'}
        hovercolor={'#607D8B'}
        editMode={false}
        openItemId={'1'}
        openItemName={'Test Scenario'}
        open={true}
        showInEditMode={true}
        location={'/test-path'}
      />
    )
  ).toMatchSnapshot();
});

test('should not display left menu items with prop showInMenu set to false', () => {
  const [option] = options;
  const updatedOption = {
    ...option,
    showInMenu: false,
  };

  const link = `${current_path}${updatedOption.path}`;

  expect(
    shallow(
      <LeftMenu
        t={t}
        current_path={current_path}
        location={'/data/1040/stations'}
        scenarioId={1040}
        scenarioName={'Scenario Test'}
        open={true}
        handleExpandCollapseMenu={jest.fn()}
        openItemId={'1'}
        openItemName={'Test Scenario'}
        editMode={false}
        options={[updatedOption]}
        name={'Test name'}
      />
    ).find(`noscript[link="${link}"]`)
  ).toHaveLength(1);
});
