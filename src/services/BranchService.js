import API from '../utils/api';

export const getAllBranches = async () => {
    try{
        let branches = await API.get(`http://localhost/wordpress/index.php/wp-json/std/branch`);

        return branches.data;
    }catch(e){
        throw e;
    }
};
