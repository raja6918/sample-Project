import React from 'react';
import { shallow } from 'enzyme';
import PasswordValidator from '../PasswordValidator';

describe('Test PasswordValidator Component', () => {
  const minProps = {
    t: jest.fn(msg => msg),
  };

  test('PasswordValidator Component renders correctly', () => {
    const wrapper = shallow(
      <PasswordValidator value="Test@12" {...minProps} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('Check whether PasswordValidator Component validates 8 characters when 8 letters provided', () => {
    const wrapper = shallow(
      <PasswordValidator value="12345678" {...minProps} />
    );
    // Title should be green
    expect(
      wrapper
        .find('PasswordValidator__Row')
        .at(0)
        .prop('style')
    ).toEqual({
      color: '#68c163',
    });
    expect(
      wrapper
        .find('PasswordValidator__Row')
        .at(0)
        .html()
    ).toContain('PASSWORD_VALIDATOR.rules.contains8Chars');
  });

  test('Check whether PasswordValidator Component validates 8 characters when 8 letters are not provided', () => {
    const wrapper = shallow(
      <PasswordValidator value="1234567" {...minProps} />
    );
    // Title should be grey
    expect(
      wrapper
        .find('PasswordValidator__Row')
        .at(0)
        .prop('style')
    ).toEqual({
      color: '#00000061',
    });
    expect(
      wrapper
        .find('PasswordValidator__Row')
        .at(0)
        .html()
    ).toContain('PASSWORD_VALIDATOR.rules.contains8Chars');
  });

  test('Check whether PasswordValidator Component validates lower and upper case letters when correct data provided', () => {
    const wrapper = shallow(<PasswordValidator value="abcABC" {...minProps} />);
    // Title should be green
    expect(
      wrapper
        .find('PasswordValidator__Row')
        .at(1)
        .prop('style')
    ).toEqual({
      color: '#68c163',
    });
    expect(
      wrapper
        .find('PasswordValidator__Row')
        .at(1)
        .html()
    ).toContain('PASSWORD_VALIDATOR.rules.containsLowerUpperCase');
  });

  test('Check whether PasswordValidator Component validates validates lower and upper case letters when correct data are not provided', () => {
    const wrapper = shallow(
      <PasswordValidator value="1234567" {...minProps} />
    );
    // Title should be grey
    expect(
      wrapper
        .find('PasswordValidator__Row')
        .at(0)
        .prop('style')
    ).toEqual({
      color: '#00000061',
    });
    expect(
      wrapper
        .find('PasswordValidator__Row')
        .at(1)
        .html()
    ).toContain('PASSWORD_VALIDATOR.rules.containsLowerUpperCase');
  });

  test('Check whether PasswordValidator Component validates numbers when correct data provided', () => {
    const wrapper = shallow(<PasswordValidator value="1" {...minProps} />);
    // Title should be green
    expect(
      wrapper
        .find('PasswordValidator__Row')
        .at(2)
        .prop('style')
    ).toEqual({
      color: '#68c163',
    });
    expect(
      wrapper
        .find('PasswordValidator__Row')
        .at(2)
        .html()
    ).toContain('PASSWORD_VALIDATOR.rules.containsNum');
  });

  test('Check whether PasswordValidator Component validates numbers when correct data not provided', () => {
    const wrapper = shallow(<PasswordValidator value="abc" {...minProps} />);
    // Title should be grey
    expect(
      wrapper
        .find('PasswordValidator__Row')
        .at(2)
        .prop('style')
    ).toEqual({
      color: '#00000061',
    });
    expect(
      wrapper
        .find('PasswordValidator__Row')
        .at(2)
        .html()
    ).toContain('PASSWORD_VALIDATOR.rules.containsNum');
  });

  test('Check whether PasswordValidator Component validates no blank space when correct data provided', () => {
    const wrapper = shallow(<PasswordValidator value="1" {...minProps} />);
    // Title should be green
    expect(
      wrapper
        .find('PasswordValidator__Row')
        .at(3)
        .prop('style')
    ).toEqual({
      color: '#68c163',
    });
    expect(
      wrapper
        .find('PasswordValidator__Row')
        .at(3)
        .html()
    ).toContain('PASSWORD_VALIDATOR.rules.containsNoBlank');
  });

  test('Check whether PasswordValidator Component validates no blank space when correct data not provided', () => {
    const wrapper = shallow(
      <PasswordValidator value="Hello World" {...minProps} />
    );
    // Title should be grey
    expect(
      wrapper
        .find('PasswordValidator__Row')
        .at(3)
        .prop('style')
    ).toEqual({
      color: '#00000061',
    });
    expect(
      wrapper
        .find('PasswordValidator__Row')
        .at(3)
        .html()
    ).toContain('PASSWORD_VALIDATOR.rules.containsNoBlank');
  });
});
