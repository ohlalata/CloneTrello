import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getAllCard = async (listId) => {
  const serviceUrl = urlConstant.endpoint.card.getAllCard.replace(
    "${listId}",
    listId
  );
  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "GET"
  );
  return response;
};

const createCard = async (listId, title) => {
  const serviceUrl = urlConstant.endpoint.card.createCard;
  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "POST",
    { listId, title }
  );
  return response;
};

export default { getAllCard, createCard };
