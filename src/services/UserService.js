import API from '../utils/api';

export const registerUser = async (data) => {
    let response = await API.post(`/user/public` , data);

    return response.data;
};
export const resendActivationCode = async (data) => {
    let response = await API.post(`/user/resend` , data);
    return response.data;
};
export const activeAccount = async (data) => {
    let response = await API.post(`/user/active` , data);
    return response.data;
};
