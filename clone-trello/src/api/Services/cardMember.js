import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const createCardMember = async (requestBody) => {
  let { userId, cardId } = requestBody;
  let data;
  const serviceUrl = urlConstant.endpoint.CardMember.createCardMember;
  if (userId && cardId) {
    data = {
      userId: userId,
      cardId: cardId,
    };
  }
  const response = await axiosLocalHost.normalRequest.post(serviceUrl, data);
  return response;
};

const getAllCardMember = async (query) => {
  let { cardId } = query;
  let params;
  const serviceUrl = urlConstant.endpoint.CardMember.getAllCardMember + cardId;
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

const changeStatus = async (query) => {
  let { id, isActive } = query;
  let data;
  let serviceUrl = urlConstant.endpoint.CardMember.inactiveCardMember + id + `?isActive=${isActive}`;
  if (id) {
    data = {
      isActive: isActive,
    };
  }
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

export default {
  createCardMember,
  getAllCardMember,
  changeStatus,
};