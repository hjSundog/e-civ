import {
    SET_USER,
    REMOVE_USER
} from '../actions/user';

let user;
try {
    user = JSON.parse(window.localStorage.getItem('user'))
} catch(err) {
    user = null
}
const initialState = {
    user: user
};

export default function auth(state = initialState, action = {}) {
    switch (action.type) {
    case SET_USER:
        window.localStorage.setItem('user', JSON.stringify(action.payload.user));
        return {
            ...state,
            user: action.payload.user
        }
    case REMOVE_USER:
        window.localStorage.removeItem('user');
        return {
            ...state,
            user: null
        }
    default:
        return state;
    }
}
