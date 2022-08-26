import API from '../../utils/api';

export const fetchMemberships = async () => {
    try{
        let response = await API.get('membership');
        return response.data;
    }catch(e){
        throw e;
    }

};

export const addMembership = async (data) => {
    try{
        let response = await API.post('membership' ,data);
        return response.data;
    }catch(e){
        throw e;
    }

};

export const updateMembership = async (id ,data) => {
    try{
        let response = await API.put('membership/'+id ,data);
        return response.data;
    }catch(e){
        throw e;
    }

};

export const deleteMembership = async (id) => {
    try{
        let response = await API.delete('membership/'+id );
        return response.data;
    }catch(e){
        throw e;
    }

};
