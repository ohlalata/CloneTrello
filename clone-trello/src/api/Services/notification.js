import urlConstant from "../../commons/urlConstant";
import axiosLocalHost from "../../utils/customAxios";

const getAllNotification = async (query) => {
    let { userId } = query;
    let params;
    const serviceUrl = urlConstant.endpoint.notification.getAllNotification;
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

const countNotification = async (query) => {
    let { userId } = query;
    let params;
    const serviceUrl = urlConstant.endpoint.notification.countNotification;
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

const getNotificationByFilter = async (query) => {
    let { userId, isRead  } = query;
    let params;
    const serviceUrl = urlConstant.endpoint.notification.getNotificationByFilter;
    if (userId) {
        params = {
            params: {
                userId: userId,
                isRead: isRead
            },
        };
    }
    const response = await axiosLocalHost.normalRequest.get(serviceUrl, params);
    return response;
};

const createNotification = async (requestBody) => {
    let { userId, title, body } = requestBody;
    let data;
    const serviceUrl = urlConstant.endpoint.notification.createNotification;
    if (userId && title && body) {
        data = {
            userId: userId,
            title: title,
            body: body
        };
      }
    const response = await axiosLocalHost.normalRequest.post(serviceUrl, data);
    return response;
};

const changeStatus = async (query) => {
    let { id, isRead } = query;
    let serviceUrl = urlConstant.endpoint.notification.readNotification + id;
    const response = await axiosLocalHost.normalRequest.put(serviceUrl, null, { params: { isRead } });
    return response;
};

export default {
    getAllNotification,
    countNotification,
    getNotificationByFilter,
    createNotification,
    changeStatus,
};
