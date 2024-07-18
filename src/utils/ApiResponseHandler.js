import { message } from 'antd';

const ApiResponse = ({ response, successCallback, errorCallback }) => {
    if (response && 'status_code' in response && response.status_code === 200) {
        if (response.data && response.data.message) {
            message.success(response.data.message);
            if (successCallback) successCallback(response);
            return;
        }
        message.success(response.message);
        if (successCallback) successCallback(response);
    } else if (response && 'detail' in response) {
        const errorDetail = response.detail[0];
        message.error(errorDetail.msg);
        if (errorCallback) errorCallback(response);
    } else {
        const errorMessage = response.message || 'Please check your internet connection or contact the support team.';
        message.error(errorMessage);
        if (errorCallback) errorCallback(response.message);
    }
};

export default ApiResponse;
