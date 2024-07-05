import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getAllTodo = async (query) => {
  let { cardId } = query;
  let params;
  const serviceUrl = urlConstant.endpoint.toDo.getAllTodo;
  if (cardId) {
    params = {
      params: {
        cardId: cardId,
      },
    };
  }
  const response = await axiosLocalHost.normalRequest.get(serviceUrl, params);
  return response;
};

const getTodoByFilter = async (query) => {
  let { cardId, isActive } = query;
  let params;
  const serviceUrl = urlConstant.endpoint.toDo.getTodoByFilter;
  if (cardId) {
    params = {
      params: {
        cardId: cardId,
        isActive: isActive,
      },
    };
  }
  const response = await axiosLocalHost.normalRequest.get(serviceUrl, params);
  return response;
};

const createTodo = async (requestBody) => {
  let { cardId, title } = requestBody;
  let data;
  const serviceUrl = urlConstant.endpoint.toDo.createTodo;
  if (cardId && title) {
    data = {
      cardId: cardId,
      title: title,
    };
  }
  const response = await axiosLocalHost.normalRequest.post(serviceUrl, data);
  return response;
};

const updateTodo = async (query) => {
  let { id, title } = query;
  let data;
  let serviceUrl = urlConstant.endpoint.toDo.updateTodo + id;
  if (id && title) {
    data = {
      title: title,
    };
  }
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

const changeStatus = async (query) => {
  let { id, isActive } = query;
  let data;
  let serviceUrl = urlConstant.endpoint.toDo.inactiveTodo + id;
  if (id) {
    data = {
      isActive: isActive,
    };
  }
  const response = axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

export default {
  getAllTodo,
  createTodo,
  updateTodo,
  changeStatus,
  getTodoByFilter,
};
