import {ADD_MEMBERSHIP, REMOVE_MEMBERSHIP} from '../constance/actionTypes';

const membershipReducer = (state = false, action) => {
    switch (action.type) {
        case ADD_MEMBERSHIP :
            return action.payload;
        case REMOVE_MEMBERSHIP :
            return null;
        default :
            return state;
    }
}
export default membershipReducer;
