import apiUtils from '../../utils/API/utils';

const solverAPI = apiUtils.buildAPI(apiUtils.getConfig().SOLVER_API);

export default solverAPI;
