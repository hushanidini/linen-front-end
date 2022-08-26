import API from '../utils/api';
import store from "../store";
import {setToken} from "../store/actions/authAction";
import {fetchUser} from "../store/actions/userAction";
import {removeMembership, setMembership} from "../store/actions/memberShipAction";
import {clearSlots} from "../store/actions/bookingAction";
import {removeBookingDetails} from "../store/actions/bookingDetailsAction";

export const loginUser = async (data) => {
    try {
        const response = await API.post( `auth/login` , data );
        await store.dispatch(fetchUser(response.data.data.user));
        await store.dispatch(setMembership(response.data.data.user.member_ship));
        await store.dispatch(setToken(response.data.data.access_token));
        return response.data;
    }catch(err) {
        throw err;
    }

};
export const refreshToken = async (data) => {
    try {
        const response = await API.post( `auth/refresh` , data );
        await store.dispatch(setToken(response.data.data.access_token));
        return response.data;
    }catch(err) {
        throw err;
    }

};

export const logOut = async () => {
    try {
        // await API.post( `/auth/logout`);
        await store.dispatch(setToken(false));
        await store.dispatch(fetchUser(false));
        await store.dispatch(removeMembership(false));
        await store.dispatch(clearSlots([]));
        await store.dispatch(removeBookingDetails(null));
        return true;
    }catch(err) {
        throw err;
    }

};
