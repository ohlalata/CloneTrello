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

export default { getAllList, createList };
