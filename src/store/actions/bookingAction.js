import {ADD_SLOTS , REMOVE_SLOTS ,CLEAR_SLOTS , INIT_LOAD_SLOTS} from '../constance/actionTypes.js';

export const addSlots = (data)=> ({type:ADD_SLOTS , payload:data});

export const removeSlots = (data)=> ({type:REMOVE_SLOTS , payload:data});

export const initLoadSlots = (data)=> ({type:INIT_LOAD_SLOTS , payload:data});

export const clearSlots = (data)=> ({type:CLEAR_SLOTS , payload:data});
