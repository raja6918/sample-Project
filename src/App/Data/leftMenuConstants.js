import AircraftTypes from './Content/AircraftTypes';
import AircraftModels from './Content/AircraftModels';
import Accommodations from './Content/Accommodations';
import CoterminalTransports from './Content/CoterminalTransports';
import Stations from './Content/Stations';
import Positions from './Content/Positions/';
import Rules from './Content/Rules';
import RuleSets from './Content/Rules/RuleSet';
import OperatingFlights from './Content/OperatingFlights';
import CommercialFlights from './Content/CommercialFlights';
import Countries from './Content/Countries';
import Currencies from './Content/Currencies';
import Regions from './Content/Regions';
import CrewBases from './Content/CrewBases';
import CrewGroups from './Content/CrewGroups';

import CurrenciesIcon from './Icons/CurrenciesIcon';
import CountriesIcon from './Icons/CountriesIcon';
import RegionsIcon from './Icons/RegionsIcon';
import CrewBasesIcon from './Icons/CrewBasesIcon';

export const getRoutes = t => {
  return [
    {
      path: '/aircraft',
      name: t('DATA.aircraft.name'),
      icon: 'airplanemode_active',
      hovercolor: '#C5267C',
      component: AircraftTypes,
      className: 'tm-vertical_menu__aircraft_types-btn',
    },
    {
      path: '/stations',
      name: t('DATA.stations.name'),
      icon: 'location_city',
      hovercolor: '#00BFA5',
      component: Stations,
      className: 'tm-vertical_menu__stations-btn',
    },
    {
      path: '/coterminal-transports',
      name: t('DATA.coterminalTransports.name'),
      icon: 'airport_shuttle',
      hovercolor: '#00C853',
      component: CoterminalTransports,
      className: 'tm-vertical_menu__coterminal_transports-btn',
    },
    {
      path: '/accommodations',
      name: t('DATA.accommodations.name'),
      icon: 'hotel',
      hovercolor: '#119798',
      component: Accommodations,
      className: 'tm-vertical_menu__accommodations-btn',
    },
    {
      path: '/positions',
      name: t('DATA.positions.name'),
      icon: 'star',
      hovercolor: '#FF9800',
      component: Positions,
      className: 'tm-vertical_menu__positions-btn',
    },
    {
      path: '/rules',
      name: t('DATA.rules.name'),
      icon: 'gavel',
      hovercolor: '#AF764C',
      component: Rules,
      className: 'tm-vertical_menu__rules-btn',
    },
    {
      path: '/rules/rule-sets',
      component: RuleSets,
      showInMenu: false,
      name: t('DATA.ruleSets.name'),
      className: '',
    },
    {
      path: '/operating-flights',
      name: t('DATA.operatingFlights.name'),
      icon: 'flight_takeoff',
      hovercolor: '#9C27B0',
      hideInEditMode: true,
      component: OperatingFlights,
      className: 'tm-vertical_menu__operating_flights-btn',
    },
    {
      path: '/commercial-flights',
      name: t('DATA.commercialFlights.name'),
      icon: 'flight_land',
      hovercolor: '#3F51B5',
      hideInEditMode: true,
      component: CommercialFlights,
      className: 'tm-vertical_menu__commercial_flights-btn',
    },
    {
      path: '/countries',
      name: t('DATA.countries.name'),
      icon: 'countries',
      svgIcon: CountriesIcon,
      hovercolor: '#4A90E2',
      component: Countries,
      className: 'tm-vertical_menu__countries-btn',
    },
    {
      path: '/currencies',
      name: t('DATA.currencies.name'),
      icon: 'currencies',
      svgIcon: CurrenciesIcon,
      hovercolor: '#158753',
      component: Currencies,
      className: 'tm-vertical_menu__currencies-btn',
    },
    {
      path: '/regions',
      name: t('DATA.regions.name'),
      icon: 'regions',
      svgIcon: RegionsIcon,
      hovercolor: '#2564AD',
      component: Regions,
      className: 'tm-vertical_menu__regions-btn',
    },
    {
      path: '/aircraft/models',
      component: AircraftModels,
      showInMenu: false,
      name: t('DATA.aircraftModels.name'),
      className: '',
    },
    {
      path: '/crew-bases',
      name: t('DATA.crewBases.name'),
      icon: 'crewBases',
      svgIcon: CrewBasesIcon,
      hovercolor: '#2564AD',
      component: CrewBases,
      viewBox: '-7 0 44 44',
      className: 'tm-vertical_menu__crew_bases-btn',
    },
    {
      path: '/crew-groups',
      name: t('DATA.crewGroups.name'),
      icon: 'group',
      hovercolor: '#F47100',
      component: CrewGroups,
      className: 'tm-vertical_menu__crew_groups-btn',
    },
  ];
};
