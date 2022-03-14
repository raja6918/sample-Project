import dataServices from './Data';
import templates from './Templates';
import users from './Users';
import home from './Home';

const services = {
  ...dataServices,
  templates,
  users,
  home,
};

export default services;
