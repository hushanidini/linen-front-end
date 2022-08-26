import API from '../utils/api';

export const fetchDiscounts = async (id) => {
    try{
        let discounts = await API.get('/discounts');
        return discounts.data;
    }catch(e){
        throw e;
    }
};

export const fetchDiscountByService = async (id) => {
    try{
        let discounts = await API.get('/discount-by-service/'+id);
        return discounts.data;
    }catch(e){
        throw e;
    }
};

export const addDiscount = async (data) => {
    try{
        let discounts = await API.post('/discount/' ,data);
        return discounts.data;
    }catch(e){
        throw e;
    }
};
export const deleteDiscount = async (id) => {
    try{
        let discounts = await API.delete('/discount/'+id);
        return discounts.data;
    }catch(e){
        throw e;
    }
};
export const updateDiscount = async (id ,data) => {
    try{
        let discounts = await API.put('/discount/'+id ,data);
        return discounts.data;
    }catch(e){
        throw e;
    }
};
