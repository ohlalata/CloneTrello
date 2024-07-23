import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getAllUserFcmToken = async (query) => {
    let { userId } = query;
    let params;
    const serviceUrl = urlConstant.endpoint.userFcmToken.getAllUserFcmToken;
    if (userId) {
        params = {
            params: {
                userId: userId,
            },
        };
    }
    const response = await axiosLocalHost.normalRequest.get(serviceUrl, params);
    return response;
};

const createUserFcmToken = async (requestBody) => {
    let { userId, fcmToken } = requestBody;
    let data;
    const serviceUrl = urlConstant.endpoint.userFcmToken.createUserFcmToken;
    if (userId && fcmToken) {
        data = {
            userId: userId,
            fcmToken: fcmToken,
        };
      }
    const response = await axiosLocalHost.normalRequest.post(serviceUrl, data);
    return response;
};

const updateUserFcmToken = async (requestBody) => {
    let { id, fcmToken } = requestBody;
    let data;
    let serviceUrl = urlConstant.endpoint.userFcmToken.updateUserFcmToken + id;
    if (id && fcmToken) {
        data = {
            id: id,
            fcmToken: fcmToken,
        };
      }
    const response = await axiosLocalHost.normalRequest.put(serviceUrl, data);
    return response;
};

const changeStatus = async (query) => {
    let { fcmToken, userId, isActive } = query;
    let serviceUrl = `${urlConstant.endpoint.userFcmToken.inactiveUserFcmToken}?fcmToken=${encodeURIComponent(fcmToken)}&userId=${userId}&isActive=${isActive}`;

    const response = await axiosLocalHost.normalRequest.put(serviceUrl);
    return response;
};

export default {
    getAllUserFcmToken,
    createUserFcmToken,
    updateUserFcmToken,
    changeStatus,
};
