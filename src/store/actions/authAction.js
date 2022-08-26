import {SET_TOKEN , REMOVE_TOKEN} from '../constance/actionTypes.js';

export const setToken = (data)=> ({type:SET_TOKEN , payload:data});

export const removeToken = (data)=> ({type:REMOVE_TOKEN , payload:null});
