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

const createBoard = async (name) => {
  const serviceUrl = urlConstant.endpoint.board.createBoard;
  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "POST",
    { name }
  );
  return response;
};

const getBoardByName = async (boardName) => {
  console.log("Fetching board by name:", boardName);
  const serviceUrl = urlConstant.endpoint.board.getBoardByName.replace("${boardName}", boardName);
  console.log("Service URL:", serviceUrl);
  const response = await axiosLocalHost.sendAuthorizedRequest(serviceUrl, "GET");
  return response;
};

export default { getAllBoard, createBoard, getBoardByName };
