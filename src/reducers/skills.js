import _ from 'lodash'
import {
    UPDATE_SKILLS,
} from '../actions/skills';

const initialState = []

export default function(state = initialState, action = {}) {
    switch (action.type) {
    case UPDATE_SKILLS:
        return _.unionBy(action.skills, state, "name")
    default:
        return state;
    }
}
