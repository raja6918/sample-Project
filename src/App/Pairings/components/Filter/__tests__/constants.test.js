import { criteriaConfig } from './../constants';
import {
  getTOGAircraftType,
  getStartAndEndDOWType,
} from './../../../../../services/Pairings';

describe('Criteria Data Resolver', () => {
  test('check whether TOG aircraft change data resolves correctly', () => {
    expect(criteriaConfig.cnxAchg.data()).toEqual(getTOGAircraftType());
  });

  test('check whether Pairings Filter Flight Start DOW data resolves correctly', () => {
    expect(criteriaConfig.flightStDow.data()).toEqual(getStartAndEndDOWType());
  });

  test('check whether Pairings Filter Flight End DOW data resolves correctly', () => {
    expect(criteriaConfig.flightEdDow.data()).toEqual(getStartAndEndDOWType());
  });

  test('check whether Flights Filter Flight Start DOW data resolves correctly', () => {
    expect(criteriaConfig.legsFlightStDow.data()).toEqual(
      getStartAndEndDOWType()
    );
  });

  test('check whether Flights Filter Flight End DOW data resolves correctly', () => {
    expect(criteriaConfig.legsFlightEdDow.data()).toEqual(
      getStartAndEndDOWType()
    );
  });
});
