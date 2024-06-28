import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getAllCard = async (query) => {
  // const serviceUrl = urlConstant.endpoint.card.getAllCard.replace(
  //   "${listId}",
  //   listId
  // );
  // const response = await axiosLocalHost.sendAuthorizedRequest(
  //   serviceUrl,
  //   "GET"
  // );

  let { listId } = query;
  let params;
  const serviceUrl = urlConstant.endpoint.card.getAllCard;
  if (listId) {
    params = {
      params: {
        listId: listId,
      },
    };
  }

  const response = await axiosLocalHost.normalRequest.get(serviceUrl, params);
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

const updateCardDescription = async (id, formData) => {
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

const changeStatus = async (id, isActive) => {
  const serviceUrl = urlConstant.endpoint.card.archiveCard
    .replace("${id}", id)
    .replace("${isActive}", isActive);

  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "PUT"
  );

  return response;
};
export default {
  getAllCard,
  createCard,
  updateCardTitle,
  changeStatus,
  updateCardDescription,
};
