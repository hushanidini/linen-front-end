import {SET_TOKEN , REMOVE_TOKEN} from '../constance/actionTypes.js';

const authReducer =(state= false ,action)=>{
    switch (action.type) {
        case SET_TOKEN :
            return action.payload;
        case REMOVE_TOKEN :
            return null;
        default :
            return state;
    }
}
export default authReducer;
