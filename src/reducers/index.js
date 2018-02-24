import { combineReducers } from 'redux';
import auth from './auth';
import person from './person';
import websocket from './websocket';
import items from './items';
const rootReducer = combineReducers({
    auth,
    person,
    items,
    websocket,
});

export default rootReducer;
