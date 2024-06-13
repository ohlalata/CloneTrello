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
  const serviceUrl = urlConstant.endpoint.board.getBoardByName.replace(
    "${boardName}",
    boardName
  );
  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "GET"
  );
  return response;
};

const changeBoardStatus = async (id, isActive) => {
  const serviceUrl = urlConstant.endpoint.board.updateBoardStatus
    .replace("${id}", id)
    .replace("${isActive}", isActive);
  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "PUT"
  );
  return response;
};

export default { getAllBoard, createBoard, getBoardByName, changeBoardStatus };
