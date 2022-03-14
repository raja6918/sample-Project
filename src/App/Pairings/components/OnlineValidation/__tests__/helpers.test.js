import { alerts } from '../mockData';
import { ErrorIcon, InfractionIcon, CautionIcon, InfoIcon } from '../icons';
import {
  getPriorityAlertType,
  getPriorityColor,
  getPriorityIcon,
  getAlertColor,
  getIcon,
} from '../helpers';

describe('Online Validation Helpers', () => {
  test('check whether getPriorityAlertType return correct priority', () => {
    expect(getPriorityAlertType(alerts[74].alerts)).toBe('error');
    expect(getPriorityAlertType(alerts[115].alerts)).toBe('warning');
    expect(getPriorityAlertType(alerts[116].alerts)).toBe('caution');
    expect(getPriorityAlertType(alerts[120].alerts)).toBe('info');
    expect(getPriorityAlertType(alerts[176].alerts)).toBe('caution');
    expect(getPriorityAlertType([])).toBe(null);
  });

  test('check whether getPriorityColor return correct priority color', () => {
    expect(getPriorityColor(alerts[74].alerts)).toBe('#D10000');
    expect(getPriorityColor(alerts[115].alerts)).toBe('#FF650C');
    expect(getPriorityColor(alerts[116].alerts)).toBe('#E8BB00');
    expect(getPriorityColor(alerts[120].alerts)).toBe('#5098E7');
    expect(getPriorityColor(alerts[176].alerts)).toBe('#E8BB00');
    // Check empty alerts
    expect(getPriorityColor([])).toBe('#000000');
    // Check whether getPriorityColor is returing color based on alertLevel
    expect(getPriorityColor(alerts[176].alerts, 'info')).toBe('#5098E7');
  });

  test('check whether getPriorityIcon return correct priority icon', () => {
    expect(getPriorityIcon(alerts[74].alerts)).toEqual(ErrorIcon);
    expect(getPriorityIcon(alerts[115].alerts)).toEqual(InfractionIcon);
    expect(getPriorityIcon(alerts[116].alerts)).toEqual(CautionIcon);
    expect(getPriorityIcon(alerts[120].alerts)).toEqual(InfoIcon);
    expect(getPriorityIcon(alerts[176].alerts)).toEqual(CautionIcon);
    // Check empty alerts
    expect(getPriorityIcon([])).toBe(null);
    // Check whether getPriorityIcon is returing icon based on alertLevel
    expect(getPriorityIcon(alerts[176].alerts, 'info')).toBe(InfoIcon);
  });

  test('check whether getAlertColor return correct color', () => {
    expect(getAlertColor('error')).toBe('#D10000');
    expect(getAlertColor('warning')).toBe('#FF650C');
    expect(getAlertColor('caution')).toBe('#E8BB00');
    expect(getAlertColor('info')).toBe('#5098E7');
    // Check empty type
    expect(getAlertColor()).toBe('#000000');
    // Check invalid type
    expect(getAlertColor('invalidkey')).toBe('#000000');
  });

  test('check whether getIcon return correct icon', () => {
    expect(getIcon('error')).toEqual(ErrorIcon);
    expect(getIcon('warning')).toEqual(InfractionIcon);
    expect(getIcon('caution')).toEqual(CautionIcon);
    expect(getIcon('info')).toEqual(InfoIcon);
    // Check empty type
    expect(getIcon()).toBe(null);
    // Check invalid type
    expect(getIcon('invalidkey')).toBe(null);
  });
});
