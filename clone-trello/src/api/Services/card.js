import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getAllCard = async (query) => {
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

const getCardByFilter = async (query) => {
  let { listId, isActive } = query;
  let params;
  const serviceUrl = urlConstant.endpoint.card.getCardByFilter;
  if (listId) {
    params = {
      params: {
        listId: listId,
        isActive: isActive,
      },
    };
  }
  const response = await axiosLocalHost.normalRequest.get(serviceUrl, params);
  return response;
};

const createCard = async (query) => {
  let { listId, title } = query;
  let data;
  const serviceUrl = urlConstant.endpoint.card.createCard;
  if (listId && title) {
    data = {
      listId: listId,
      title: title,
    };
  }
  const response = await axiosLocalHost.normalRequest.post(serviceUrl, data);
  return response;
};

const updateCardTitle = async (query) => {
  let { id, title } = query;
  let data;
  let serviceUrl = urlConstant.endpoint.card.updateCard + id;
  if (id && title) {
    data = {
      title: title,
    };
  }
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

const updateCardDescription = async (query) => {
  let { id, description, title } = query;
  let data;
  let serviceUrl = urlConstant.endpoint.card.updateCard + id;
  if (id && title) {
    data = {
      description: description,
      title: title,
    };
  }
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

const updateCardDates = async (query) => {
  let { id, description, startDate, endDate, reminderDate, title } = query;
  let data;
  let serviceUrl = urlConstant.endpoint.card.updateCard + id;
  if (id && title) {
    data = {
      description: description,
      title: title,
    };
    if (startDate) {
      data.startDate = startDate;
    }
    if (endDate) {
      data.endDate = endDate;
    }
    if (reminderDate) {
      data.reminderDate = reminderDate;
    }
  }
  //console.log("data", data);
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

const changeStatus = async (query) => {
  let { id, isActive } = query;
  let data;
  let serviceUrl = urlConstant.endpoint.card.archiveCard + id;
  if (id) {
    data = {
      isActive: isActive,
    };
  }
  const response = axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

export default {
  getAllCard,
  createCard,
  updateCardTitle,
  changeStatus,
  updateCardDescription,
  getCardByFilter,
  updateCardDates,
};
