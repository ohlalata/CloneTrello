import axios from "axios";
import url from "../commons/urlConstant";

const axiosClient = axios.create({
  baseURL: url.base,
});

const sendAuthorizedRequest = async (url, method, data = null, config = {}) => {
  let accessToken = localStorage.getItem("accessToken");
  const headers = {};

  headers["Authorization"] = `Bearer ${accessToken}`;
  try {
    const response = await axiosClient({
      method,
      url,
      headers: { ...headers, ...config.headers },
      data,
    });
    return response;
  } catch (error) {
    console.error("error fetching data: ", error);
    throw error;
  }
};

const axiosLocalHost = {
  sendAuthorizedRequest,
  normalRequest: axiosClient,
};

export default axiosLocalHost;
