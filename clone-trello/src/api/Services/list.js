import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getAllList = async (query) => {
  let { boardId } = query;
  let params;
  const serviceUrl = urlConstant.endpoint.list.getAllList;
  if (boardId) {
    params = {
      params: {
        boardId: boardId,
      },
    };
  }
  const response = await axiosLocalHost.normalRequest.get(serviceUrl, params);
  return response;
};

const createList = async (requestBody) => {
  let { boardId, name } = requestBody;
  let data;
  const serviceUrl = urlConstant.endpoint.list.createList;
  if (boardId && name) {
    data = {
      boardId: boardId,
      name: name,
    };
  }
  const response = await axiosLocalHost.normalRequest.post(serviceUrl, data);
  return response;
};

const updateListName = async (query) => {
  // const serviceUrl = urlConstant.endpoint.list.updateList.replace("${id}", id);
  // const config = {
  //   header: {
  //     "Content-Type": "multipart/form-data",
  //   },
  // };
  // const response = await axiosLocalHost.sendAuthorizedRequest(
  //   serviceUrl,
  //   "PUT",
  //   formData,
  //   config
  // );
  let { id, BoardId, Name } = query;
  let data = new FormData();
  const config = {
    header: {
      "Content-Type": "multipart/form-data",
    },
  };
  let serviceUrl = urlConstant.endpoint.list.updateList + id;
  if (BoardId && Name) {
    data.append("BoardId", id);
    data.append("Name", Name);
  }
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

const changeStatus = async (query) => {
  let { id, isActive } = query;
  let data;
  let serviceUrl = urlConstant.endpoint.list.archiveList + id;
  if (id) {
    data = {
      isActive: isActive,
    };
  }
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

export default { getAllList, createList, updateListName, changeStatus };
