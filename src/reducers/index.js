import { combineReducers } from 'redux';
import auth from './auth';
import sidebar from './sidebar'
const rootReducer = combineReducers({
    auth,sidebar
});

export default rootReducer;
