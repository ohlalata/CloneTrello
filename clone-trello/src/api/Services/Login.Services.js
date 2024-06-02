import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const login = async (email, password) => {
  const serviceUrl = urlConstant.endpoint.auth.login;
  const response = await axiosLocalHost.normalRequest.post(serviceUrl, {
    email,
    password,
  });
  return response;
};

export default { login };
