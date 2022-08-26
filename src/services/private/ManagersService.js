import API from '../../utils/api';

export const fetchManagers = async () => {
    try{
        let managers = await API.get('users/managers');
        return managers.data;
    }catch(e){
        throw e;
    }

};
