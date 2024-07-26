import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getAllCardLabel = async (query) => {
  let { cardId } = query;
  let params;
  const serviceUrl = urlConstant.endpoint.cardLabel.getAllCardLabel;
  if (cardId) {
    params = {
      params: {
        cardId: cardId,
      },
    };
  }
  const response = await axiosLocalHost.normalRequest.get(serviceUrl, params);
  return response;
};

const createCardLabel = async (query) => {
  let { cardId, labelId } = query;
};

export default { getAllCardLabel };
