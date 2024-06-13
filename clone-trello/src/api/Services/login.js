import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const login = async (email, password) => {
  const serviceUrl = urlConstant.endpoint.auth.login;
  const response = await axiosLocalHost.normalRequest.post(serviceUrl, {
    email,
    password,
  });

  const accessToken = response.data.bearer;
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  } else {
    console.log("Access token not found!");
  }

  return response;
};

export default { login };
