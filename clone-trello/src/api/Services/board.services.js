import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getAllBoard = async () => {
  const serviceUrl = urlConstant.endpoint.board.getAllBoard;
  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "GET"
  );
  return response;
};

export default { getAllBoard };
