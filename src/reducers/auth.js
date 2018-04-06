import {
    SET_USER,
    REMOVE_USER,
    UPDATE_USER
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
        return {
            ...state,
            user: action.payload.user
        }
    case REMOVE_USER:
        return {
            ...state,
            user: null
        }
    case UPDATE_USER: {
        const us = {
            ...state.user,
            ...action.payload.user
        };
        return {
            ...state,
            user: us
        }
    }
    default:
        return state;
    }
}
