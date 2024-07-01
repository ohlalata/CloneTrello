import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getAllList = async (query) => {
  let { boardId } = query;
  let params;
  const serviceUrl = urlConstant.endpoint.list.getAllList;
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

const createList = async (requestBody) => {
  let { boardId, name } = requestBody;
  let data;
  const serviceUrl = urlConstant.endpoint.list.createList;
  if (boardId && name) {
    data = {
      boardId: boardId,
      name: name,
    };
  }
  const response = await axiosLocalHost.normalRequest.post(serviceUrl, data);
  return response;
};

const updateListName = async (query) => {
  let { id, boardId, name } = query;
  let data;

  let serviceUrl = urlConstant.endpoint.list.updateList + id;
  if (boardId && name) {
    data = {
      boardId: boardId,
      name: name,
    };
  }
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

const changeStatus = async (query) => {
  let { id, isActive } = query;
  let data;
  let serviceUrl = urlConstant.endpoint.list.archiveList + id;
  if (id) {
    data = {
      isActive: isActive,
    };
  }
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

export default { getAllList, createList, updateListName, changeStatus };
