import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const createBoardMember = async (userId, boardId) => {
  const serviceUrl = urlConstant.endpoint.boardMember.createBoardMember;
  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "POST",
    { userId, boardId }
  );
  return response;
};
const getAllBoardMember = async (boardId) => {
  const serviceUrl = urlConstant.endpoint.boardMember.getAllBoardMember.replace(
    "${boardId}",
    boardId
  );
  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "GET"
  );
  return response;
};

export default { createBoardMember, getAllBoardMember };
