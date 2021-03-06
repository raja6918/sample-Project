const dataAnalyticsRegex = [
  {
    name: 'dashboard',
    pattern: /(dashboard)$/,
    dataCard: false,
    screen: 'Dashboard',
  },
  {
    name: 'scenarios',
    pattern: /(scenarios)$/,
    dataCard: false,
    screen: 'Scenario - Home - Listing',
  },
  {
    name: 'users',
    pattern: /(users)$/,
    dataCard: false,
    screen: 'Users - Home - Listing',
  },
  {
    name: 'templates',
    pattern: /(templates)$/,
    dataCard: false,
    screen: 'Templates - Home - Listing',
  },
  {
    name: 'reports',
    pattern: /(reports)$/,
    dataCard: false,
    screen: 'Scenario Reports - Home - Listing',
  },
  {
    name: 'settings',
    pattern: /(settings)$/,
    dataCard: false,
    screen: 'Scenario Settings - Home - Listing',
  },
  {
    name: 'crew-groups',
    pattern: /(data)\/\d+\/(crew-groups)/,
    dataCard: true,
    screen: 'Data - Crew Groups Listing',
  },
  {
    name: 'accommodations',
    pattern: /(data)\/\d+\/(accommodations)/,
    dataCard: true,
    screen: 'Data - Accomodations Listing',
  },
  {
    name: 'aircraft',
    pattern: /(data)\/\d+\/(aircraft)/,
    dataCard: true,
    screen: 'Data - Aircraft Types Listing',
  },
  {
    name: 'aircraft-models',
    pattern: /(data)\/\d+\/(aircraft)\/(models)/,
    dataCard: true,
    screen: 'Data - Aircraft Models Listing',
  },
  {
    name: 'commercial-flights',
    pattern: /(data)\/\d+\/(commercial-flights)/,
    dataCard: true,
    screen: 'Data - Commercial Flights Listing',
  },
  {
    name: 'coterminal-transports',
    pattern: /(data)\/\d+\/(coterminal-transports)/,
    dataCard: true,
    screen: 'Data - Coterminal Transports Listing',
  },
  {
    name: 'countries',
    pattern: /(data)\/\d+\/(countries)/,
    dataCard: true,
    screen: 'Data - Countries Listing',
  },
  {
    name: 'crew-bases',
    pattern: /(data)\/\d+\/(crew-bases)/,
    dataCard: true,
    screen: 'Data - Crew Bases Listing',
  },
  {
    name: 'currencies',
    pattern: /(data)\/\d+\/(currencies)/,
    dataCard: true,
    screen: 'Data - Currencies Listing',
  },
  {
    name: 'operating-flights',
    pattern: /(data)\/\d+\/(operating-flights)/,
    dataCard: true,
    screen: 'Data - Operating Flights Listing',
  },
  {
    name: 'positions',
    pattern: /(data)\/\d+\/(positions)/,
    dataCard: true,
    screen: 'Data - Positions Listing',
  },
  {
    name: 'regions',
    pattern: /(data)\/\d+\/(regions)/,
    dataCard: true,
    screen: 'Data - Regions Listing',
  },
  {
    name: 'rules',
    pattern: /(data)\/\d+\/(rules)/,
    dataCard: true,
    screen: 'Data - Rules Listing',
  },
  {
    name: 'rule-sets',
    pattern: /(data)\/\d+\/(rules)\/(rule-sets)/,
    dataCard: true,
    screen: 'Data - RuleSet Listing',
  },
  {
    name: 'stations',
    pattern: /(data)\/\d+\/(stations)/,
    dataCard: true,
    screen: 'Data - Stations Listing',
  },
  {
    name: 'data-home',
    pattern: /(data)\/\d+$/,
    dataCard: false,
  },
  {
    name: 'solver',
    pattern: /(solver)\/\d+$/,
    dataCard: false,
    screen: 'Scenario Solver Requests - Home - Listing',
  },
  {
    name: 'pairings',
    pattern: /(pairings)\/\d+$/,
    dataCard: false,
    screen: 'Scenario Pairings - Home - Listing',
  },
];

export default dataAnalyticsRegex;
