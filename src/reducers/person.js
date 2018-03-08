import {
    CREATE_PERSON,
    UPDATE_PERSON,
    DELETE_PERSON,
    INIT_PERSON,
    RESET_PERSON
} from '../actions/person';

import _ from 'lodash'

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


function cloneObject(obj) {
    if(typeof obj === "object") {
        if(Array.isArray(obj)) {
            var newArr = [];
            for(var i = 0; i < obj.length; i++) newArr.push(obj[i]);
            return newArr;
        } else {
            var newObj = {};
            for(var key in obj) {
                newObj[key] = cloneObject(obj[key]);
            }
            return newObj;
        }
    } else {
        return obj;
    }
}

// 更改目标对象(pre)同提供对象(update)属性相同的值,不同层级也可以改变，
// 查找属性顺序为逐层查找，如果最底层都没有这个属性，则将该属性加入顶层并赋值。
function personUpdateProxy(pre, update) {
    const rt = cloneObject(pre);

    Object.entries(update).forEach(function(ele) {
        //递归寻找对象是否有这个属性
        function recursion(target) {
            for(let key in target) {
                //建相等
                if(key === ele[0]) {
                    //如果值为对象
                    if(toString.call(target[key]).slice(8, -1) === 'Object') {
                        //建相等,这里先简单的这样做，不考虑深度克隆的情况
                        target[key] = {
                            ...target[key],
                            ...ele[1]
                        }
                    } else {          
                        target[key] = ele[1];
                    }
                } else if(toString.call(target[key]).slice(8, -1) === 'Object') {             
                    recursion(target[key])
                }

            }
        }
        recursion(rt);
    })


    return {...pre,...rt}
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
        return _.assign(state, action.person)
    case DELETE_PERSON:
        return {}
    default:
        return state;
    }
}
