import API from '../../utils/api';

export const getAllShifts = async () => {
    try{
        let shifts = await API.get('/shift');
        return shifts.data;
    }catch(e){
        throw e;
    }
};
export const fetchShiftByServiceId = async (id) => {
    try{
        let shifts = await API.get('/shift-by-service/'+id);
        return shifts.data;
    }catch(e){
        throw e;
    }
};
export const addNewShift = async (data) => {
    try{
        let shifts = await API.post('/shift' , data);
        return shifts.data;
    }catch(e){
        throw e;
    }
};
export const deleteShift = async (id) => {
    try{
        let shifts = await API.delete('/shift/'+id);
        return shifts.data;
    }catch(e){
        throw e;
    }
};

export const updateShift = async (id  ,data) => {
    try{
        let shifts = await API.put('/shift/'+id , data);
        return shifts.data;
    }catch(e){
        throw e;
    }
};
