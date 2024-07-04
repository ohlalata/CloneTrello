import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const Register = async (query) => {
  let { name, email, password } = query;
  let data;
  const serviceUrl = urlConstant.endpoint.auth.register;
  if (name && email && password) {
    data = {
      name: name,
      email: email,
      password: password,
    };
  }
  const response = await axiosLocalHost.normalRequest.post(serviceUrl, data);
  return response;
};

export default { Register };
