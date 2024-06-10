import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const login = async (email, password) => {
  const serviceUrl = urlConstant.endpoint.auth.login
    .replace("${email}", email)
    .replace("${password}", password);
  const response = await axiosLocalHost.normalRequest.post(serviceUrl);
  return response;
};

export default { login };
