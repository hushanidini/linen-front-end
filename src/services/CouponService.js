import API from '../utils/api';

export const checkPromoCode = async (code) => {
    let response = await API.get(`/check-coupon/`+code);
    return response.data;
};
