import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getAllLabel = async (query) => {
  let { boardId } = query;
  let params;
  const serviceUrl = urlConstant.endpoint.label.getAllLabel;
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

const createLabel = async (query) => {
  let { boardId, name, color } = query;
  let data;
  const serviceUrl = urlConstant.endpoint.label.createLabel;
  if (boardId && color) {
    data = {
      boardId: boardId,
      name: name,
      color: color,
    };
  }
  const response = await axiosLocalHost.normalRequest.post(serviceUrl, data);
  return response;
};

const updateLabel = async (query) => {
  let { id, name, color } = query;
  let data;
  let serviceUrl = urlConstant.endpoint.label.updateLabel + id;
  if (id && color) {
    data = {
      name: name,
      color: color,
    };
  }
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

const deleteLabel = async (query) => {
  let { id, isActive } = query;
  let data;
  let serviceUrl = urlConstant.endpoint.label.deleteLabel + id;
  if (id) {
    data = {
      isActive: isActive,
    };
  }
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

export default {
  getAllLabel,
  createLabel,
  updateLabel,
  deleteLabel,
};
