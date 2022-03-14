import { DATA } from '../constants';

import { getStations } from '../services/Data/stations';
import { getRegions } from '../services/Data/regions';
import { getCurrencies } from '../services/Data/currencies';
import { getCrewBases } from '../services/Data/crewBases';
import { getCountries } from '../services/Data/countries';
import { getAircrafts } from '../services/Data/aircraftTypes';
import { getModels } from '../services/Data/aircraftModels';
import { getPositions } from '../services/Data/positions';
import { getAirlineIdentifiers } from '../services/Data/operatingFlights';

const dynamicEnumAPIResolver = {
  station: getStations,
  currency: getCurrencies,
  region: getRegions,
  base: getCrewBases,
  country: getCountries,
  aircraftType: getAircrafts,
  aircraftModel: getModels,
  position: getPositions,
  airline: getAirlineIdentifiers,
  stationLayoverTimeMin: getStations,
  regionLayoverTimeMin: getRegions,
};

export const setMasterData = (key, data) => ({
  type: DATA.SET_MASTER_DATA,
  key,
  data,
});

export const clearMasterData = () => ({
  type: DATA.CLEAR_MASTER_DATA,
});

export const fetchMasterData = (key, scenarioId) => {
  return async dispatch => {
    try {
      const dataAPI = dynamicEnumAPIResolver[key];
      const response = await dataAPI(scenarioId);
      if (response) {
        // Transform the response data to the format required by enum component
        if (Array.isArray(response.data)) {
          const data = response.data.map(e => ({
            ...e,
            value: e.code,
            label: e.code,
          }));
          dispatch(setMasterData(key, data));
        } else {
          const data = response.map(e => ({
            ...e,
            value: e.code,
            label: e.code,
          }));
          dispatch(setMasterData(key, data));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
};
