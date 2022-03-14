export const DEBUG_MODE = process.env.NODE_ENV === 'production' ? false : true;

export const CARRY_IN_DAYS = 7;
export const CARRY_OUT_DAYS = 7;
export const MAX_PERIOD_DAYS = 56;

export const MIN_ROWS_NUMBER = 25;
export const PAIRING_HEIGHT = 38;
export const PAIRING_TOP = 18;
export const ROW_HEIGHT = 62;
export const ROW_COUNT = 1;
export const ROWS_TO_FETCH = 30;

export const MIN_WIDTH_TO_RENDER_LABELS = 30;

export const MAX_TIMELINE_WINDOWS = 3;
export const MIN_TIMELINE_WINDOW_HEIGHT = 115;
export const MIN_TIMELINE_WINDOW_HEIGHT_COLLAPSED = 22;

export const STATION_LABEL_WIDTH = 40;
export const PAIRING_NAME_LABEL_MIN_WIDTH = 80;

export const zoomLevels = {
  levelOne: 1,
  levelTwo: 3,
  levelThree: 4,
};

export const classZoomMonths = 'month-day';

export const classZoomDays = 'day';

export const fewDaysTime = [
  '02:00',
  '04:00',
  '06:00',
  '08:00',
  '10:00',
  '12:00',
  '14:00',
  '16:00',
  '18:00',
  '20:00',
  '22:00',
];

export const oneDayTime = [
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
];

export const DEFAULT_COLOR = '#000';

export const COLORS = {
  BRF: 'linear-gradient(180deg, #3CC020 3%, #004900 100%)', // green
  DBRF: 'linear-gradient(180deg, #3CC020 3%, #004900 100%)', // green
  FLT: 'linear-gradient(180deg, #139AE3 0%, #011DA2 100%)', // blue
  CNX: 'linear-gradient(180deg, #C7C7C7 0%, #9D9D9D 93%)',
  CNX_AIRCRAFTCHANGE: 'linear-gradient(180deg, #828282 0%, #6A6A6A 100%)',
  LCNX: 'linear-gradient(180deg, #C7C7C7 0%, #9D9D9D 93%)',
  LCNX_AIRCRAFTCHANGE: 'linear-gradient(180deg, #828282 0%, #6A6A6A 100%)',
  LO: 'linear-gradient(0deg, #F0F0F0 0%, #DCDCDC 100%)', // gray
  DHI: 'linear-gradient(180deg, #9575CD 4%, #311B92 97%)', // purple
  CML: 'linear-gradient(180deg, #D42371 4%, #6B002F 100%)',
  COTRM: 'linear-gradient(180deg, #FFD54F 0%, #FF6F00 100%)', // yellow
};
