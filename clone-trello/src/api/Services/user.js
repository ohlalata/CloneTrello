import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getUserById = async (id) => {
  const serviceUrl = urlConstant.endpoint.user.getUserById.replace("${id}", id);
  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "GET"
  );
  return response;
};

export default { getUserById };
