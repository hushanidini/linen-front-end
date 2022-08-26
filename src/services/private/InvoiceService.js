import API from '../../utils/api';

export const fetchBookingDetails = async (data) => {
    try{
        let response = await API.get(`/booking-details`,{params:data});
        return response.data;
    }catch(e){
        throw e;
    }

};
export const requestToCancel = async (id,data) => {
    try{
        let response = await API.post('/booking-details/request-cancel/'+id,  data);
        return response.data;
    }catch(e){
        throw e;
    }

};

export const confirmCancel = async (id,data) => {
    try{
        let response = await API.post('/booking-details/cancel-confirm/'+id,  data);
        return response.data;
    }catch(e){
        throw e;
    }

};

export const fetchBookingDetailsById = async (id , data) => {
    try{
        let response = await API.get(`/booking-details/`+id ,{params:data});
        return response.data;
    }catch(e){
        throw e;
    }

};
