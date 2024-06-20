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
const changeStatus = async (id, isActive) => {
  const serviceUrl = urlConstant.endpoint.boardMember.inactiveBoardMember
    .replace("${id}", id)
    .replace("${isActive}", isActive);

  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "PUT"
  );

  return response;
};

const getCurrentBoardMemberRole = async (boardId) => {
  const serviceUrl = urlConstant.endpoint.boardMember.getCurrentBoardMemberRole.replace(
    "${boardId}",
    boardId
  );
  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "GET"
  );
  return response;
};

const updateBoardMember = async (id, roleId) => {
  const serviceUrl = urlConstant.endpoint.boardMember.updateBoardMember
    .replace("${id}", id)
    .replace("${roleId}", roleId);

  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "PUT"
  );

  return response;
};

export default { createBoardMember, getAllBoardMember, changeStatus, getCurrentBoardMemberRole, updateBoardMember };
