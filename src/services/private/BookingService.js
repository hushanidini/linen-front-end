import API from '../../utils/api';

export const fetchBookedData = async (service_id , data) => {
    try{
        let response = await API.get('/public/booked/'+service_id ,  {params:data});
        return response.data;
    }catch(e){
        throw e;
    }
};

export const fetchBookedDataPrivate = async (data) => {
    try{
        let response = await API.get('/booked-slots' ,  {params:data});
        return response.data;
    }catch(e){
        throw e;
    }
};

export const saveBookingData = async (user_id , data) => {
    try{
        let response = await API.post('/public/booking/new/'+user_id ,  data);
        return response.data;
    }catch(e){
        throw e;
    }
};

export const checkAvailability = async ( data) => {
    try{
        let response = await API.post('/public/availability' ,  data);
        return response.data;
    }catch(e){
        throw e;
    }
};
