import { combineReducers } from 'redux';
import auth from './auth';
import person from './person';
import websocket from './websocket';
const rootReducer = combineReducers({
    auth,
    person,
    websocket,
});

export default rootReducer;
