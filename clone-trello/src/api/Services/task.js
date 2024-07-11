import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getAllTask = async (query) => {
  let { todoId } = query;
  let params;
  const serviceUrl = urlConstant.endpoint.task.getAllTask;
  if (todoId) {
    params = {
      params: {
        todoId: todoId,
      },
    };
  }
  const response = await axiosLocalHost.normalRequest.get(serviceUrl, params);
  return response;
};

const getTaskByFilter = async (query) => {
  let { todoId, name, isActive } = query;
  let params;
  const serviceUrl = urlConstant.endpoint.task.getTaskByFilter;
  if (todoId) {
    params = {
      params: {
        todoId: todoId,
        name: name,
        isActive: isActive,
      },
    };
  }
  const response = await axiosLocalHost.normalRequest.get(serviceUrl, params);
  return response;
};

const createTask = async (requestBody) => {
  let { todoId, name, priorityLevel, assignedUserId, description, status, dueDate } = requestBody;
  let data;
  const serviceUrl = urlConstant.endpoint.task.createTask;
  if (todoId && name && priorityLevel !== undefined && status !== undefined) {
    data = {
      todoId: todoId,
      name: name,
      priorityLevel: priorityLevel,
      status: status,
    };

    if (assignedUserId) {
      data.assignedUserId = assignedUserId;
    }
    if (description) {
      data.description = description;
    }
    if (dueDate) {
      data.dueDate = dueDate;
    }
  }
  const response = await axiosLocalHost.normalRequest.post(serviceUrl, data);
  return response;
};

const updateTask = async (requestBody) => {
  let { id, name, priorityLevel, assignedUserId, description, status, dueDate } = requestBody;
  let data;
  let serviceUrl = urlConstant.endpoint.task.updateTask + id;
  if (id && name && priorityLevel !== undefined && status !== undefined) {
    data = {
      name: name,
      priorityLevel: priorityLevel,
      status: status,
    };

    if (assignedUserId) {
      data.assignedUserId = assignedUserId;
    }
    if (description) {
      data.description = description;
    }
    if (dueDate) {
      data.dueDate = dueDate;
    }
  }
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

const updateCheckTask = async (query) => {
  let { id, isChecked } = query;
  let serviceUrl = urlConstant.endpoint.task.checkTask + id;
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, null, { params: { isChecked } });
  return response;
};

const changeStatus = async (query) => {
  let { id, isActive } = query;
  let data;
  let serviceUrl = urlConstant.endpoint.task.inactiveTask + id;
  if (id) {
    data = {
      isActive: isActive,
    };
  }
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

export default {
  getAllTask,
  createTask,
  updateTask,
  updateCheckTask,
  changeStatus,
  getTaskByFilter,
};
