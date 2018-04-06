import {
    SET_USER,
    CLEAR_USER,
    UPDATE_USER,
} from '../actions/user';

const initialState = {
};

export default function user(state = initialState, action = {}) {
    switch (action.type) {
    case SET_USER:
        return {...action.payload.user}
    case CLEAR_USER:
        return initialState
    case UPDATE_USER:
        return {...state,...action.payload.user}
    default:
        return state;
    }
}
