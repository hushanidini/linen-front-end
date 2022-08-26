import {ADD_SLOTS , REMOVE_SLOTS ,CLEAR_SLOTS ,INIT_LOAD_SLOTS} from '../constance/actionTypes.js';
import {cloneDeep, findIndex} from "lodash";
import moment from "moment";


const bookingReducer = (state = [], action) => {
    switch (action.type) {
        case ADD_SLOTS : {
            let data = cloneDeep(state);
            const indexBySer = findIndex(data ,{service_id : action.payload.service_id});
            if(indexBySer !== -1){
                const newData = {
                    slot:action.payload.slot,
                    price:action.payload.price,
                    shift_id:action.payload.shift_id,
                }
                data[indexBySer].slots.push(newData);
            }else{
                const newData = {
                    slot:action.payload.slot,
                    price:action.payload.price,
                    shift_id:action.payload.shift_id,
                }
                data.push({service_id : action.payload.service_id , slots: [newData]});
            }
            return data;
        }
        case REMOVE_SLOTS : {
            let data = cloneDeep(state);
            const indexBySer= findIndex(data ,{service_id : action.payload.service_id});
            if(indexBySer !== -1){
                const isBooked = findIndex(data[indexBySer].slots, (e) => {
                    return moment(action.payload.slot, 'YYYY-MM-DD HH:mm:ss').isSame(moment(e.slot, 'YYYY-MM-DD HH:mm'));
                }, 0);
                data[indexBySer].slots.splice(isBooked, 1);
            }
            return data;
        }
        case INIT_LOAD_SLOTS :
            return action.payload;
        case CLEAR_SLOTS :
            return [];
        default : {
            return state;
        }
    }
}
export default bookingReducer;
