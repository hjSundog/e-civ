import {
    CREATE_PERSON,
    UPDATE_PERSON,
    DELETE_PERSON,
    INIT_PERSON,
    RESET_PERSON,
    UPDATE_PERSON_POI, // 更新人物地理位置
} from '../actions/person';

import _ from 'lodash'

const initialState = {
    name: 'init person',
    id: null,
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
    },
    state: 'available',  // 暂定三个状态 available, moving, doing
    position: {  // 当前经纬度位置
        lon: 12.3,
        lat: 30,
    },
};

export default function auth(state = initialState, action = {}) {
    switch (action.type) {
    case INIT_PERSON:
        return {...action.person}
    case RESET_PERSON:
        return initialState
    case CREATE_PERSON:
        return {...state,...action.person}
    case UPDATE_PERSON:
        return _.assign(state, action.person)
    case DELETE_PERSON:
        return {}
    case UPDATE_PERSON_POI:
        return {
            ...state,
            position: action.position
        }
    default:
        return state;
    }
}
