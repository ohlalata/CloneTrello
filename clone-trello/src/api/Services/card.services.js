import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getAllCard = async () => {
  const serviceUrl = urlConstant.endpoint.card.getAllCard;
  const response = await axiosLocalHost.sendAuthorizedRequest(
    serviceUrl,
    "GET"
  );
  return response;
};

export default { getAllCard };
