export const MODULE_NAME = 'OPS';
export const PANE_LABELS = {
  COLUMN: 'ColumnHeader',
  PAIRING: 'PairingPane',
  FLIGHT: 'FlightPane',
  EMPTY: 'EmptyPane',
};

export const CARRY_IN_DAYS = 7;
export const CARRY_OUT_DAYS = 7;
export const MAX_PERIOD_DAYS = 56;
export const PAIRING_NAME_LABEL_MIN_WIDTH = 40;
export const RELATIVE_DAY_BUFFER = 7;
export const MAX_TIMELINE_WINDOWS = 3;

export const isTreeMode = false;
export const isSplitMode = false;

export const TYPE_RENDER_MAP = {
  PRG: 'pairings',
  FLT: 'legs',
  DHI: 'dhi',
  CML: 'cml',
};

export const TYPE_GANTT_ITEM_MAP = {
  PRG: 'sierraPairings',
  FLT: 'sierraFlights',
  DHI: 'sierraFlights',
  CML: 'sierraFlights',
};
