import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getAllBoard = async () => {
  const serviceUrl = urlConstant.endpoint.board.getAllBoard;
  const response = await axiosLocalHost.normalRequest.get(serviceUrl);
  return response;
};

//------------------------------------------------------------------------------------
// const getBoardByFilter = async (query) => {
//   let { pageIndex, pageSize, name } = query;

//   const serviceUrl = urlConstant.endpoint.board.getBoardByFilter; //getBoardByFilter edit

//   let params = {
//     pageIndex: 1, //default
//     pageSize: 50, //default
//   };

//   if (pageIndex && pageSize) {
//     params = {
//       pageIndex: parseInt(pageIndex),
//       pageSize: parseInt(pageSize),
//     };
//   }

//   if (name) {
//     params = {
//       ...params,
//       boardName: name,
//     };
//   }

//   const response = await axiosLocalHost.normalRequest.get(serviceUrl, params);
// };

//--------------------------------------------------------------------------------------

const createBoard = async (requestBody) => {
  const serviceUrl = urlConstant.endpoint.board.createBoard;
  let { name } = requestBody;
  let data;
  if (name) {
    data = {
      name: name,
    };
  }
  const response = await axiosLocalHost.normalRequest.post(serviceUrl, data);
  return response;
};

const getBoardByName = async (query) => {
  let { name } = query;
  const serviceUrl = urlConstant.endpoint.board.getBoardByFilter;
  let params;
  if (name) {
    params = {
      params: { name: name },
    };
  }
  const response = await axiosLocalHost.normalRequest.get(serviceUrl, params);
  return response;
};

const changeBoardStatus = async (query) => {
  let { id, isActive } = query;
  let data;
  let serviceUrl = urlConstant.endpoint.board.updateBoardStatus + id;
  if (id) {
    data = {
      isActive: isActive,
    };
  }

  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

const updateBoardName = async (query) => {
  // const serviceUrl = urlConstant.endpoint.board.updateBoardName.replace(
  //   "${id}",
  //   id
  // );
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

  let { id, Name } = query;

  let data = new FormData();
  const config = {
    header: {
      "Content-Type": "multipart/form-data",
    },
  };
  const serviceUrl = urlConstant.endpoint.board.updateBoardName + id;
  if (id && Name) {
    data.append("Name", Name);
  }
  const response = await axiosLocalHost.normalRequest.put(
    serviceUrl,
    data,
    config
  );
  return response;
};

const updateBoardVisibility = async (query) => {
  let { id, isPublic } = query;
  let data;
  const serviceUrl = urlConstant.endpoint.board.updateBoardVisibility + id;
  if (id) {
    data = {
      isPublic: isPublic,
    };
  }
  const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
  return response;
};

export default {
  getAllBoard,
  createBoard,
  getBoardByName,
  changeBoardStatus,
  updateBoardName,
  updateBoardVisibility,
};
