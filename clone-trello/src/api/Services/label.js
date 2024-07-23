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
};

export default {
  getAllLabel,
};
