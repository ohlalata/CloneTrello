import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const Register = async (email, password, name) => {
  const serviceUrl = urlConstant.endpoint.auth.register;
  const response = await axiosLocalHost.normalRequest.post(serviceUrl, {
    email,
    password,
    name,
  });
  return response;
};

export default { Register };
