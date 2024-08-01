import axios from "axios";
import url from "../commons/urlConstant";

let axiosClient = axios.create({
  baseURL: url.base,
  headers: {
    "Content-Type": "application/json",
  },
});

//interceptor

const setAuthToken = async (token) => {
  if (token) {
    axiosClient.defaults.headers.common["Authorization"] = "Bearer " + token;
    localStorage.setItem("token", token);
  } else {
    delete axiosClient.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

console.log("axiosClient", axiosClient.defaults);

const axiosLocalHost = {
  //sendAuthorizedRequest,
  setAuthToken,
  normalRequest: axiosClient,
};

export default axiosLocalHost;
