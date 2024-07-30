import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const createCardActivity = async (query) => {
  let { activity, cardId, userId } = query;
  let data;
  let serviceUrl = urlConstant.endpoint.cardActivity.createCardActivity;
  if (cardId && userId) {
    data = {
      activity: activity,
      cardId: cardId,
      userId: userId,
    };
  }
  const response = await axiosLocalHost.normalRequest.post(serviceUrl, data);
  return response;
};

const getAllCardActivity = async (query) => {
  let { cardId } = query;
  let params;
  let serviceUrl = urlConstant.endpoint.cardActivity.getAllCardActivity;
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

export default {
  createCardActivity,
  getAllCardActivity,
};
