import L from 'react-loadable';
import Loading from './Loading';

const Loadable = opts =>
  L({
    delay: 300,
    loading: Loading,
    ...opts,
  });

export default Loadable;
