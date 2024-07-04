import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getAllRole = async (query) => {
  let { id, name } = query;
  let params = {};
  
  if (id) {
    params.id = id;
  }

  if (name) {
    params.name = name;
  }

  const serviceUrl = urlConstant.endpoint.role.getAllRole;
  
  const response = await axiosLocalHost.normalRequest.get(serviceUrl, { params });
  return response;
};

export default { getAllRole };
