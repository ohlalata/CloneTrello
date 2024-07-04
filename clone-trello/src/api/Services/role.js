import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getAllRole = async (id, name) => {
  let serviceUrl = urlConstant.endpoint.role.getAllRole;
  if (id) {
    serviceUrl = serviceUrl.replace("${Id}", id);
  } else {
    serviceUrl = serviceUrl.replace("${Id}", "");
  }
  if (name) {
    serviceUrl = serviceUrl.replace("${name}", name);
  } else {
    serviceUrl = serviceUrl.replace("${name}", "");
  }
  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "GET"
  );
  return response;
};

export default { getAllRole };
