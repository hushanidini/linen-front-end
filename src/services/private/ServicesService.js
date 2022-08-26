import API from '../../utils/api';

export const getAllServices = async () => {
    try{
        let service = await API.get('/service' );
        return service.data;
    }catch(e){
        throw e;
    }

};
export const getAllServicesByBranch = async (id) => {
    try{
        let service = await API.get('/service-by-branch/'+id );
        return service.data;
    }catch(e){
        throw e;
    }

};
export const getServiceById = async (id) => {
    try{
        let service = await API.get('/service/'+id);
        return service.data;
    }catch(e){
        throw e;
    }

};
export const saveService = async (data) => {
    try{
        let service = await API.post('service' , data);
        return service.data;
    }catch(e){
        throw e;
    }

};

export const updateService = async (id ,data) => {
    try{
        let service = await API.put('service/'+id , data);
        return service.data;
    }catch(e){
        throw e;
    }

};

export const deleteService = async (id) => {
    try{
        let service = await API.delete('service/'+id );
        return service.data;
    }catch(e){
        throw e;
    }

};


export const updateHtmlTags = async (id , data) => {
    try{
        // let service = await API.get('/service/'+id);
        let service = await API.put('/service/html-tags/'+id , data);
        return service.data;
    }catch(e){
        throw e;
    }

};
