import API from '../../utils/api';

export const searchUser = async (data) => {
    try{
        let users = await API.get('/users/search',{params:data});
        return users.data;
    }catch(e){
        throw e;
    }
};
