import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const createBoardMember = async (userId, boardId) => {
  const serviceUrl = urlConstant.endpoint.boardMember.createBoardMember;
  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "POST",
    { userId, boardId }
  );
  return response;
};

export default { createBoardMember };
