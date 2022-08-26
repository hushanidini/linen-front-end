import {ADD_MEMBERSHIP , REMOVE_MEMBERSHIP} from '../constance/actionTypes.js';

export const setMembership = (data)=> ({type:ADD_MEMBERSHIP , payload:data});

export const removeMembership = (data)=> ({type:REMOVE_MEMBERSHIP , payload:null});
