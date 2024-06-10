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

const updateCardTitle = async (id, formData) => {
  const serviceUrl = urlConstant.endpoint.card.updateCard.replace("${id}", id);
  const config = {
    header: {
      "Content-Type": "multipart/form-data",
    },
  };
  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "PUT",
    formData,
    config
  );
  return response;
};
export default { getAllCard, createCard, updateCardTitle };
