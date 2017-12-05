import {
    SET_USER,
    REMOVE_USER
} from '../actions/user';

const initialState = {
    user: null,
};


export default function user(state = initialState, action = {}) {
    switch (action.type) {
    case SET_USER:
        window.localStorage.setItem('user', action.payload.data);
        return {
            ...state,
            user: user
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
