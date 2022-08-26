import API from '../../utils/api';

export const getAllBranches = async () => {
    let branches = await API.get('/branch');

    return branches.data;
};

export const fetchBranchById = async (id) => {
    let branches = await API.get('/branch/'+id);

    return branches.data;
};

export const saveBranches = async (data) => {
    try{
        let branches = await API.post('/branch',data);

        return branches.data;
    }catch(e){
        throw e;
    }
};
export const updateBranches = async (id ,data) => {
    try{
        let branches = await API.put('branch/'+id,data);

        return branches.data;
    }catch(e){
        throw e;
    }
};
export const deleteBranch = async (id) => {
    try{
        let branches = await API.delete('branch/'+id);

        return branches.data;
    }catch(e){
        throw e;
    }
};
export const addBranches = async (data) => {
    try{
        let response = await API.post('users/add-branches' , data);
        return response.data;
    }catch(e){
        throw e;
    }
};

export const addManager = async (data) => {
    try{
        let response = await API.post('users/add-user' , data);
        return response.data;
    }catch(e){
        throw e;
    }
};
