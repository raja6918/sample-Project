import React from 'react';
import { shallow } from 'enzyme';
import ColorHighlighter from '../ColorHighlighter';

const mockProps = {
  value: 'Test',
  data: { name: 'Test' },
  style: { color: '#FF650C' },
  highlighter: () => true,
};

test('ColorHighlighter Component render correctly', () => {
  const wrapper = shallow(<ColorHighlighter {...mockProps} />);
  expect(wrapper).toMatchSnapshot();
});
