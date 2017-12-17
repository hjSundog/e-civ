import { combineReducers } from 'redux';
import auth from './auth';
import sidebar from './sidebar';
import websocket from './websocket';
const rootReducer = combineReducers({
    auth,
    sidebar,
    websocket,
});

export default rootReducer;
