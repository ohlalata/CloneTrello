import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const createCardMember = async (userId, cardId) => {
  const serviceUrl = urlConstant.endpoint.CardMember.createCardMember;
  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "POST",
    { userId, cardId }
  );
  return response;
};
const getAllCardMember = async (cardId) => {
  const serviceUrl = urlConstant.endpoint.CardMember.getAllCardMember.replace(
    "${cardId}",
    cardId
  );
  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "GET"
  );
  return response;
};


export default { createCardMember, getAllCardMember };
