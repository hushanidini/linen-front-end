import {FETCH_USER, REMOVE_USER} from '../constance/actionTypes';

export const fetchUser = data => ({type: FETCH_USER, payload: data});

export const removeUser = data => ({type: REMOVE_USER, payload: null});
