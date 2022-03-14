import i18next from 'i18next';
import merge from 'deepmerge';

const language = process.env.ALTITUDE_LANGUAGE || 'en';
const company = process.env.ALTITUDE_LABELS || 'fedex';

const resources = merge.all([
  require(`./locales/${language}/common.json`),
  require(`./locales/${language}/errors.json`),
  require(`./locales/${language}/success.json`),
  require(`./locales/${language}/${company}`),
]);

i18next.init({
  debug: process.env.NODE_ENV === 'production' ? false : true,
  interpolation: { escapeValue: false },
  lng: language,
  resources: {
    [`${language}`]: {
      translation: resources,
    },
  },
});

export default i18next;
