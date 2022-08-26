import {ADD_BOOKING_DETAILS ,REMOVE_BOOKING_DETAILS} from '../constance/actionTypes.js';

const bookingDetailsReducer =(state= false ,action)=>{
    switch (action.type) {
        case ADD_BOOKING_DETAILS :
            return action.payload;
        case REMOVE_BOOKING_DETAILS :
            return null;
        default :
            return state;
    }
}
export default bookingDetailsReducer;
