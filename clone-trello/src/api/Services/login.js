import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const login = async (email, password) => {
  const serviceUrl = urlConstant.endpoint.auth.login;
  try {
    const response = await axiosLocalHost.normalRequest.post(serviceUrl, {
      email,
      password,
    });
    const accessToken = response.data.bearer;
    axiosLocalHost.setAuthToken(accessToken);
    return response;
  } catch (error) {
    console.error(error);
    axiosLocalHost.setAuthToken(null);
  }
};

export default { login };
