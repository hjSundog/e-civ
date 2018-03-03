import { combineReducers } from 'redux';
import auth from './auth';
import person from './person';
import websocket from './websocket';
import items from './items';
import skills from './skills';

const rootReducer = combineReducers({
    auth,
    person,
    items,
    websocket,
    skills,
});

export default rootReducer;
