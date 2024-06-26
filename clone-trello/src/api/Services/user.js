import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getUserById = async (id) => {
  const serviceUrl = urlConstant.endpoint.user.getUserById.replace("${id}", id);
  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "GET"
  );
  return response;
};
const getAllUser = async (email, name) => {
  const serviceUrl = urlConstant.endpoint.user.getAllUser.replace("${email}", email).replace("${name}", name);
  const response = await axiosLocalHost.sendAuthorizedRequest(serviceUrl, "GET");
  return response;
};

const searchUsers = async (keyword) => {
  let serviceUrl = `${urlConstant.base}${urlConstant.endpoint.user.getAllUser}`;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailPattern.test(keyword)) {
    serviceUrl = serviceUrl.replace("${email}", keyword).replace("${name}", "");
  } else {
    serviceUrl = serviceUrl.replace("${email}", "").replace("${name}", keyword);
  }

  const response = await axiosLocalHost.sendAuthorizedRequest(serviceUrl, "GET");
  return response;
};

export default { getUserById, getAllUser, searchUsers };
