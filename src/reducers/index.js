import { combineReducers } from 'redux';
import user from './user';
import person from './person';
import websocket from './websocket';
import items from './items';
import skills from './skills';
import game from './game'

const rootReducer = combineReducers({
    user,
    person,
    items,
    websocket,
    skills,
    game,
});

export default rootReducer;
