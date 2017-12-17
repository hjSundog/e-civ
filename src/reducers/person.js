import {
    CREATE_PERSON,
    UPDATE_PERSON,
    DELETE_PERSON,
    INIT_PERSON,
    RESET_PERSON
} from '../actions/person';
import Page2 from '@/views/Page2';


const initialState = {
    name: 'init person',
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

function personUpdateProxy(pre, update) {
    const rt = {...pre}
    //先写死conditions
    rt.conditions = {
        ...rt.conditions,
        ...update
    }
    return {
        ...pre,
        ...rt
    }
}

export default function auth(state = initialState, action = {}) {
    switch (action.type) {
    case INIT_PERSON:
        return {...action.person}
    case RESET_PERSON:
        return initialState
    case CREATE_PERSON:
        return {...state,...action.person}
    case UPDATE_PERSON:
        return {...personUpdateProxy(state, action.person)}
    case DELETE_PERSON:
        return {}
    default:
        return state;
    }
}
