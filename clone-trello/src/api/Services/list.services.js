import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getAllList = async (boardId) => {
  const serviceUrl = urlConstant.endpoint.list.getAllList.replace(
    "${boardId}",
    boardId
  );
  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "GET"
  );
  return response;
};

const createList = async (boardId, name) => {
  const serviceUrl = urlConstant.endpoint.list.createList;
  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "POST",
    { boardId, name }
  );
  return response;
};

const updateListName = async (id, formData) => {
  const serviceUrl = urlConstant.endpoint.list.updateListName.replace(
    "${id}",
    id
  );
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

export default { getAllList, createList, updateListName };
