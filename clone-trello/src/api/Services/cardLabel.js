import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getAllCardLabel = async (query) => {
  let { cardId } = query;
  let params;
  const serviceUrl = urlConstant.endpoint.cardLabel.getAllCardLabel;
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

const createCardLabel = async (query) => {
  let { cardId, labelId } = query;
  let data;
  const serviceUrl = urlConstant.endpoint.cardLabel.createCardLabel;
  if (cardId && labelId) {
    data = {
      cardId: cardId,
      labelId: labelId,
    };
  }
  const response = await axiosLocalHost.normalRequest.post(serviceUrl, data);
  return response;
};

const deleteCardLabel = async (query) => {
  let { id, isActive } = query;
  let data;
  const serviceUrl = urlConstant.endpoint.cardLabel.deleteCardLabel + id;
  if (id) {
    data = {
      isActive: isActive,
    };
  }
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

const updateCardLabel = async (query) => {
  let { id, labelId } = query;
  let params;
  const serviceUrl = urlConstant.endpoint.cardLabel.updateCardLabel + id;
  if (id && labelId) {
    params = {
      params: {
        labelId: labelId,
      },
    };
  }
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, params);
  return response;
};

export default {
  getAllCardLabel,
  createCardLabel,
  deleteCardLabel,
  updateCardLabel,
};
