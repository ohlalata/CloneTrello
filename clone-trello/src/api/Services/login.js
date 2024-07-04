import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const login = async (query) => {
  let { email, password } = query;
  let data;
  const serviceUrl = urlConstant.endpoint.auth.login;
  try {
    if (email && password) {
      data = {
        email: email,
        password: password,
      };
    }
    const response = await axiosLocalHost.normalRequest.post(serviceUrl, data);
    const accessToken = response.data.bearer;
    axiosLocalHost.setAuthToken(accessToken);
    return response;
  } catch (error) {
    console.error(error);
    axiosLocalHost.setAuthToken(null);
  }
};

export default { login };
