import axios from 'axios';
import store from "../store";
import {setToken} from "../store/actions/authAction";

const API = axios.create({
    baseURL:"http://laravel.24by7.ca/public/api/"
});
// Add a request interceptor
API.interceptors.request.use(
    config => {
        const state = store.getState();
        const token = state.auth;
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    error => Promise.reject(error)
);


API.interceptors.response.use(
    response => response,
    error =>{
        if(error.response.status !== 401){
            return Promise.reject(error);
        }

        return API.post(`auth/refresh` ,null).then(response =>{
            store.dispatch(setToken(response.data.data.access_token));
            error.response.config.headers['Authorization'] = 'Bearer '+ response.data.data.access_token;
            return axios(error.response.config);
        }).catch(error =>{
            return Promise.reject(error);
        })
    }
);
export default API;
