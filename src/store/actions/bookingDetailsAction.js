import {ADD_BOOKING_DETAILS ,REMOVE_BOOKING_DETAILS} from '../constance/actionTypes.js';

export const addBookingDetails = (data)=> ({type:ADD_BOOKING_DETAILS , payload:data});

export const removeBookingDetails = (data)=> ({type:REMOVE_BOOKING_DETAILS , payload:data});
