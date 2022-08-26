import API from '../../utils/api';

export const getCoupons = async () => {
    let coupon = await API.get('coupon/all');

    return coupon.data;
};

export const addCoupon = async (data) => {
    try{
        let coupon = await API.post('coupon' , data);
        return coupon.data;
    }catch(e){
        throw e;
    }
};

export const updateCoupon = async (id,data) => {
    try{
        let coupon = await API.put('coupon/'+id , data);
        return coupon.data;
    }catch(e){
        throw e;
    }
};

export const deleteCoupon = async (id) => {
    try{
        let coupon = await API.delete('coupon/'+id );
        return coupon.data;
    }catch(e){
        throw e;
    }
};
