import {combineReducers ,createStore , applyMiddleware} from 'redux';
import {authReducer,
        userReducer,
        bookingReducer,
        membershipReducer,
        bookingDetailsReducer} from './reducers';
import thunk from 'redux-thunk';
import { persistStore , persistReducer} from "redux-persist";
import {AsyncStorage} from "AsyncStorage";


const persistConfig ={
    key:'root',
    storage:AsyncStorage,
    version:0,
}
const rootReducer = combineReducers({
    auth:authReducer,
    user:userReducer,
    slots:bookingReducer,
    membership:membershipReducer,
    bookingDetails:bookingDetailsReducer
});

const persistedReducer = persistReducer(persistConfig , rootReducer);
const store = createStore(persistedReducer , applyMiddleware(thunk));
export const persistor = persistStore(store);
export default store;
