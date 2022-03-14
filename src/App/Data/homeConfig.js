import CurrenciesIcon from './Icons/CurrenciesIcon';
import CountriesIcon from './Icons/CountriesIcon';
import RegionsIcon from './Icons/RegionsIcon';
import CrewBasesIcon from './Icons/CrewBasesIcon';

const iconStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
};

const crewBaseIconStyles = {
  ...iconStyles,
  transform: 'translate(-35%,-45%)',
};

export const dataCardsComplement = {
  accommodation: {
    translationKey: 'DATA.accommodations.name',
    icon: 'hotel',
    link: '/accommodations',
    bgIcon: '#119798',
  },
  aircraftType: {
    translationKey: 'DATA.aircraft.name',
    icon: 'airplanemode_active',
    link: '/aircraft',
    bgIcon: '#C5267C',
  },
  deadheadAggregate: {
    translationKey: 'DATA.commercialFlights.name',
    icon: 'flight_land',
    link: '/commercial-flights',
    bgIcon: '#616FBD',
  },
  coterminalTransport: {
    translationKey: 'DATA.coterminalTransports.name',
    icon: 'airport_shuttle',
    link: '/coterminal-transports',
    bgIcon: '#00C853',
  },
  country: {
    translationKey: 'DATA.countries.name',
    link: '/countries',
    icon: CountriesIcon,
    isCustomIcon: true,
    bgIcon: '#4A90E2',
    iconStyles,
  },
  base: {
    translationKey: 'DATA.crewBases.name',
    icon: CrewBasesIcon,
    isCustomIcon: true,
    link: '/crew-bases',
    bgIcon: '#00b8d4',
    iconStyles: crewBaseIconStyles,
    viewBox: '-7 0 44 44',
  },
  flight: {
    translationKey: 'DATA.operatingFlights.name',
    icon: 'flight_takeoff',
    link: '/operating-flights',
    bgIcon: '#B363C1',
  },
  position: {
    translationKey: 'DATA.positions.name',
    icon: 'star',
    link: '/positions',
    bgIcon: '#FF9800',
  },
  region: {
    translationKey: 'DATA.regions.name',
    icon: RegionsIcon,
    isCustomIcon: true,
    link: '/regions',
    bgIcon: '#2564AD',
    iconStyles,
  },
  rule: {
    translationKey: 'DATA.rules.name',
    icon: 'gavel',
    link: '/rules',
    bgIcon: '#AF764C',
  },
  station: {
    translationKey: 'DATA.stations.name',
    icon: 'location_city',
    link: '/stations',
    bgIcon: '#00BFA5',
  },
  currency: {
    translationKey: 'DATA.currencies.name',
    link: '/currencies',
    icon: CurrenciesIcon,
    isCustomIcon: true,
    bgIcon: '#158753',
    iconStyles,
  },
  crewGroup: {
    translationKey: 'DATA.crewGroups.name',
    icon: 'group',
    link: '/crew-groups',
    bgIcon: '#F47100',
  },
  _default: {
    translationKey: null,
    icon: 'warning',
    bgIcon: '#ccc',
  },
};

function getComplementaryInfo(dataType, t) {
  let complementaryInfo =
    dataCardsComplement[dataType] || dataCardsComplement['_default'];

  const { translationKey } = complementaryInfo;
  const name = translationKey ? t(translationKey) : dataType;

  complementaryInfo = { name, ...complementaryInfo };

  return complementaryInfo;
}

export function complementDataHome(dataTypes, t) {
  const dataHomeConfig = [];
  for (let i = 0; i < dataTypes.length; i++) {
    const dataType = dataTypes[i];
    const type = dataType.type;
    const complementaryInfo = getComplementaryInfo(type, t);

    dataHomeConfig.push({
      sequence: i + 1,
      ...dataType,
      ...complementaryInfo,
    });
  }

  return dataHomeConfig;
}
