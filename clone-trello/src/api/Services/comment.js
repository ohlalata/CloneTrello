import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getAllComment = async (query) => {
  let { cardId } = query;
  const serviceUrl = urlConstant.endpoint.comment.getAllComment;
  let params;
  if (cardId) {
    params = {
      params: { cardId: cardId },
    };
  }
  const response = await axiosLocalHost.normalRequest.get(serviceUrl, params);
  return response;
};

const createComment = async (query) => {
  let { cardId, content } = query;
  const serviceUrl = urlConstant.endpoint.comment.createComment;
  let data;
  if (cardId && content) {
    data = {
      cardId: cardId,
      content: content,
    };
  }
  const response = await axiosLocalHost.normalRequest.post(serviceUrl, data);
  return response;
};

const deleteComment = async (query) => {
  let { id, isActive } = query;
  const serviceUrl = urlConstant.endpoint.comment.deleteComment + id;
  let data;
  if (id) {
    data = {
      isActive: isActive,
    };
  }
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

const updateComment = async (query) => {
  let { id, stringEdit } = query;
  const serviceUrl = urlConstant.endpoint.comment.updateComment + id;
  let data;
  if (id && stringEdit) {
    data = stringEdit;
  }
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

export default { getAllComment, createComment, deleteComment, updateComment };
