import {FETCH_USER, REMOVE_USER} from '../constance/actionTypes';

const userReducer = (state = false, action) => {
    switch (action.type) {
        case FETCH_USER :
            return action.payload;
        case REMOVE_USER :
            return null;
        default :
            return state;
    }
}
export default userReducer;
