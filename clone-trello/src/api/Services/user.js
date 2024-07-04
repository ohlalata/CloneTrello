import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getUserById = async (query) => {
  let { id } = query;
  let serviceUrl = urlConstant.endpoint.user.getUserById + id;
  const response = await axiosLocalHost.normalRequest.get(serviceUrl);
  return response;
};

const getAllUser = async (email, name) => {
  const serviceUrl = urlConstant.endpoint.user.getAllUser;
  // .replace("${email}", email)
  // .replace("${name}", name);
  // const response = await axiosLocalHost.sendAuthorizedRequest(
  //   serviceUrl,
  //   "GET"
  // );
  const response = await axiosLocalHost.normalRequest.get(serviceUrl);
  return response;
};

const searchUsers = async (query) => {
  // let serviceUrl = `${urlConstant.base}${urlConstant.endpoint.user.getAllUser}`;
  // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // if (emailPattern.test(keyword)) {
  //   serviceUrl = serviceUrl.replace("${email}", keyword).replace("${name}", "");
  // } else {
  //   serviceUrl = serviceUrl.replace("${email}", "").replace("${name}", keyword);
  // }
  // const response = await axiosLocalHost.sendAuthorizedRequest(serviceUrl, "GET");

  let { keyword } = query;
  let params;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const serviceUrl = urlConstant.endpoint.user.getUserByFilter;
  if (emailPattern.test(keyword)) {
    params = {
      params: { email: keyword },
    };
  } else {
    params = {
      params: { name: keyword },
    };
  }

  const response = await axiosLocalHost.normalRequest.get(serviceUrl, params);

  return response;
};

const getUserProfile = async () => {
  const serviceUrl = urlConstant.endpoint.user.getUserProfileByToken;
  const response = await axiosLocalHost.normalRequest.get(serviceUrl);
  return response;
};

export default { getUserById, getAllUser, searchUsers, getUserProfile };
