import {
    CHANGE_ATTRIBUTE,
    INIT_SIDEBAR,
    CHANGE_STATE
} from '../actions/sidebar';

const initialState = {
    name: 'test fdff',
    person_id: null,
    attributes: {
        str: 1,
        dex: 1,
        con: 1,
        int: 1,
        wis: 1,
        cha: 1
    },
    items: [],
    des: '这里使用redux比较好吧',
    conditions: {
        health: 100,
        maxHealth: 100,
        stamina: 100,
        maxStamina: 100
    },
    status: [],
    meta: {
        age: 0,
        sex: 'male'
    }
};

export default function auth(state = initialState, action = {}) {
    switch (action.type) {
    case INIT_SIDEBAR:
        return initialState
    case CHANGE_ATTRIBUTE:{
        let temp = { ...state }
        temp.attributes = {
            ...temp.attributes,
            ...action.attribute
        };
        return {
            ...state,
            ...temp
        }
    }
    case CHANGE_STATE:{
        let temp = { ...state }
        temp.conditions = {
            ...temp.conditions,
            ...action.state
        };
        return {
            ...state,
            ...temp
        }
    }
    default:
        return state;
    }
}
