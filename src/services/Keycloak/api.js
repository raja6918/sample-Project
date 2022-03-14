import apiUtils from '../../utils/API/utils';

const keycloakAPI = apiUtils.buildAPI(apiUtils.getConfig().KEYCLOAK_API);

export default keycloakAPI;
