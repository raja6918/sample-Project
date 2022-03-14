##Support multiple base URLs in Platform

###Solution
Implement a factory of APIs.

###API instances
Create an instance per baseURL and reuse it as many times as the user requests it (Singleton pattern). The creation is based on demand, so the API instance should be created only if it is needed.

This is an example how to create a new API instance,
```Javascript
// api.js
import utils from '<path-to-api-folder>/utils';

const config = utils.getConfig();
const API = utils.buildAPI(config.USER_API);

export default API;
```

###Interceptors
All interceptors are registered in each instance.

###Refreshing JWT
To refresh an expired JWT, it must do the request to the API that contains user´s authentication.

###Services layer
Instead of making the http requests to the server inside each react component, we need to abstract those calls into a new layer named services. This layer should be placed in `src/services` directory and all the availables methods grouped by entity, E.g. `src/services/regions/`, `...`, `src/services/scenarios/`.
Each folder `index.js` should contain a set of methods to interact with the entity, E.g.
```Javascript
// services/regions/index.js
import API from './api';

export function getRegions() {
  return API.get('/data/regions');
}
```
and use those methods in the components,
```Javascript
// some/component/file.jsx
import * as regionServices from '../services/Data/regions';

class Form extends Component {
  componentDidMount() {
    regionServices.getRegions()
      .then(regions => {
        // do sth with regions.
      });
  }

  render() {
    ....
  }
}
```
