import CurrenciesIcon from '../Icons/CurrenciesIcon';
import CountriesIcon from '../Icons/CountriesIcon';
import RegionsIcon from '../Icons/RegionsIcon';
import CrewBasesIcon from '../Icons/CrewBasesIcon';

const customIconStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-48%,-48%)',
};

const iconStyles = {
  transform: 'translate(3px,4px)',
};

export const dataTypesComplement = {
  accommodation: {
    translationKey: 'DATA.import.fileTypes.accommodation',
    icon: 'hotel',
    iconStyles: {
      ...iconStyles,
    },
  },
  aircraftType: {
    translationKey: 'DATA.import.fileTypes.aircraftType',
    icon: 'airplanemode_active',
    iconStyles: {
      ...iconStyles,
      transform: 'translate(4px,4px)',
    },
  },
  deadheadAggregate: {
    translationKey: 'DATA.import.fileTypes.commercialFlight',
    icon: 'flight_land',
    iconStyles: {
      ...iconStyles,
    },
  },
  coterminalTransport: {
    translationKey: 'DATA.import.fileTypes.coterminalTransport',
    icon: 'airport_shuttle',
    iconStyles: {
      ...iconStyles,
    },
  },
  country: {
    translationKey: 'DATA.import.fileTypes.country',
    icon: CountriesIcon,
    isCustomIcon: true,
    iconStyles: {
      ...customIconStyles,
    },
  },
  base: {
    translationKey: 'DATA.import.fileTypes.base',
    icon: CrewBasesIcon,
    isCustomIcon: true,
    iconStyles: {
      ...customIconStyles,
      transform: 'translate(-32%,-46%)',
    },
  },
  flight: {
    translationKey: 'DATA.import.fileTypes.flight',
    icon: 'flight_takeoff',
    iconStyles: {
      ...iconStyles,
    },
  },
  position: {
    translationKey: 'DATA.import.fileTypes.position',
    icon: 'star',
    iconStyles: {
      ...iconStyles,
      transform: 'translate(4px,4px)',
    },
  },
  region: {
    translationKey: 'DATA.import.fileTypes.region',
    icon: RegionsIcon,
    isCustomIcon: true,
    iconStyles: {
      ...customIconStyles,
    },
  },
  rule: {
    translationKey: 'DATA.import.fileTypes.rule',
    icon: 'gavel',
    iconStyles: {
      ...iconStyles,
      transform: 'translate(4px,4px)',
    },
  },
  station: {
    translationKey: 'DATA.import.fileTypes.station',
    icon: 'location_city',
    iconStyles: {
      ...iconStyles,
      transform: 'translate(4px,4px)',
    },
  },
  currency: {
    translationKey: 'DATA.import.fileTypes.currency',
    icon: CurrenciesIcon,
    isCustomIcon: true,
    iconStyles: {
      ...customIconStyles,
      transform: 'translate(-45%,-48%)',
    },
  },
  crewGroup: {
    translationKey: 'DATA.crewGroups.name',
    icon: 'group',
    iconStyles: {
      ...iconStyles,
      transform: 'translate(4px,4px)',
    },
  },
  pairing: {
    translationKey: 'DATA.import.fileTypes.pairing',
    icon: 'subtitles',
    iconStyles: {
      ...iconStyles,
    },
  },
};

function generateImportOptions(name, dataType) {
  const fileOptions = [];

  dataType.files.forEach(file => {
    const key = file.key;
    const option = {};
    if (key && key !== '') {
      const keyArray = key.split('~');
      const indicator = keyArray.length === 2 ? keyArray[1] : 'SFX';
      const fixedKey = keyArray[0].split('_').join(' ');
      let errorName = '';
      let extraKey = '';

      switch (indicator) {
        case 'SFX':
        default:
          extraKey = `(${fixedKey})`;
          errorName = `${name} (${fixedKey})`;
          break;
        case 'PFX':
          extraKey = `${fixedKey} -`;
          errorName = `${fixedKey} - ${name}`;
          break;
        case 'KNL':
          extraKey = `${fixedKey}`;
          errorName = `${fixedKey}`;
          break;
        case 'NKY':
          extraKey = '';
          errorName = `${name}`;
          break;
      }

      option.name = name;
      option.id = file.id;
      option.indicator = indicator;
      option.extraKey = extraKey;
      option.errorString = errorName;
    } else {
      option.name = name;
      option.errorString = name;
      option.id = file.id;
    }

    fileOptions.push(option);
  });

  return fileOptions;
}

export function complementDynamicRules(dynamicRender, t) {
  const dataTypesArray = Object.entries(dynamicRender);
  const importConfig = [];
  let importFileOptions = [];

  for (let i = 0; i < dataTypesArray.length; i++) {
    const type = dataTypesArray[i][0];
    const dataType = dataTypesArray[i][1];

    let complementaryInfo = dataTypesComplement[type] || null;

    if (complementaryInfo) {
      const { translationKey } = complementaryInfo;
      const name = translationKey ? t(translationKey) : type;

      complementaryInfo = { type, name, ...complementaryInfo };
      importConfig.push({ ...dataType, ...complementaryInfo });

      importFileOptions = importFileOptions.concat(
        generateImportOptions(name, dataType)
      );
    }
  }

  importFileOptions.sort((a, b) => (a.name > b.name ? 1 : -1));

  return {
    importConfig,
    importFileOptions,
  };
}
