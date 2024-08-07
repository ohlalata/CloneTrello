import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getAllBoard = async () => {
  const serviceUrl = urlConstant.endpoint.board.getAllBoard;
  const response = await axiosLocalHost.normalRequest.get(serviceUrl);
  return response;
};

const createBoard = async (requestBody) => {
  const serviceUrl = urlConstant.endpoint.board.createBoard;
  let { name } = requestBody;
  let data;
  if (name) {
    data = {
      name: name,
    };
  }
  const response = await axiosLocalHost.normalRequest.post(serviceUrl, data);
  return response;
};

const getBoardByName = async (query) => {
  let { name } = query;
  const serviceUrl = urlConstant.endpoint.board.getBoardByFilter;
  let params;
  if (name) {
    params = {
      params: { name: name },
    };
  }
  const response = await axiosLocalHost.normalRequest.get(serviceUrl, params);
  return response;
};

const changeBoardStatus = async (query) => {
  let { id, isActive } = query;
  let data;
  let serviceUrl = urlConstant.endpoint.board.updateBoardStatus + id;
  if (id) {
    data = {
      isActive: isActive,
    };
  }

  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

const updateBoardName = async (query) => {
  let { id, name } = query;
  let data;
  const serviceUrl = urlConstant.endpoint.board.updateBoardName + id;
  if (id && name) {
    data = {
      name: name,
    };
  }
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

const updateBoardVisibility = async (query) => {
  let { id, isPublic } = query;
  let data;
  const serviceUrl = urlConstant.endpoint.board.updateBoardVisibility + id;
  if (id) {
    data = {
      isPublic: isPublic,
    };
  }
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

const getBoardByMember = async () => {
  const serviceUrl = urlConstant.endpoint.board.getBoardByMember;
  const response = await axiosLocalHost.normalRequest.get(serviceUrl);
  return response;
};

export default {
  getAllBoard,
  createBoard,
  getBoardByName,
  changeBoardStatus,
  updateBoardName,
  updateBoardVisibility,
  getBoardByMember,
};
