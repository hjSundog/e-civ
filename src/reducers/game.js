import {
    SET_GAME,
} from '../actions/game';

const initialState = {

}

export default function(state = initialState, action = {}) {
    switch (action.type) {
    case SET_GAME:
        return {...state, ...action.game}
    default:
        return state;
    }
}
