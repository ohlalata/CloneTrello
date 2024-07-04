import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const createBoardMember = async (requestBody) => {
  let { userId, boardId } = requestBody;
  let data;
  const serviceUrl = urlConstant.endpoint.boardMember.createBoardMember;
  if (userId && boardId) {
    data = {
      userId: userId,
      boardId: boardId,
    };
  }
  const response = await axiosLocalHost.normalRequest.post(serviceUrl, data);
  return response;
};

const getAllBoardMember = async (query) => {
  let { boardId } = query;
  let params;
  const serviceUrl = urlConstant.endpoint.boardMember.getAllBoardMember;
  if (boardId) {
    params = {
      params: {
        boardId: boardId,
      },
    };
  }
  const response = await axiosLocalHost.normalRequest.get(serviceUrl, params);
  return response;
};

const changeStatus = async (query) => {
  let { id, isActive } = query;
  let data;
  let serviceUrl = urlConstant.endpoint.boardMember.inactiveBoardMember + id;
  if (id) {
    data = {
      isActive: isActive,
    };
  }
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

const getCurrentBoardMemberRole = async (query) => {
  let { boardId } = query;
  let params;
  const serviceUrl = urlConstant.endpoint.boardMember.getCurrentBoardMemberRole;
  if (boardId) {
    params = {
      params: {
        boardId: boardId,
      },
    };
  }
  const response = await axiosLocalHost.normalRequest.get(serviceUrl, params);
  return response;
};

const updateBoardMember = async (query) => {
  let { id, roleId } = query;
  if (!id || !roleId) {
    return;
  }

  let serviceUrl = `${urlConstant.endpoint.boardMember.updateBoardMember}${id}?roleId=${roleId}`;

  try {
    const response = await axiosLocalHost.normalRequest.put(serviceUrl);
    return response;
  } catch (error) {
    throw error; 
  }
};

export default {
  createBoardMember,
  getAllBoardMember,
  changeStatus,
  getCurrentBoardMemberRole,
  updateBoardMember,
};
