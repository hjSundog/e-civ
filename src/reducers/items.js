import {
    ADD_FROM_ITEM,
    DELETE_FROM_ITEM,
    DELETE_ALL_FROM_ITEMS,
    ADD_FROM_EXTRA,
    CHAGNE_FROM_EXTRA,
    ADD_TO_ITEM,
    DELETE_TO_ITEM,
    DELETE_ALL_TO_ITEMS,
    ADD_TO_EXTRA,
    CHAGNE_TO_EXTRA,
    INIT_PACKAGE
} from '../actions/items';


const initialState = {
    fromItems: {
        payload: [],
        extra: []
    },
    toItems: {
        payload: [],
        extra: []
    },
    packageItems: [],
    hasInitialed: false
};

export default function auth(state = initialState, action = {}) {
    switch (action.type) {
    case ADD_FROM_ITEM:
        return {
            ...state,
            fromItems: {
                ...state.fromItems,
                payload: [...state.fromItems.payload, action.payload]
            }
        };
    case DELETE_FROM_ITEM:
    case DELETE_ALL_FROM_ITEMS:
    case ADD_FROM_EXTRA:
    case CHAGNE_FROM_EXTRA:
    case ADD_TO_ITEM:
        return {
            ...state,
            toItems: {
                ...state.toItems,
                payload: [...state.toItems.payload, action.payload]
            }
        };
    case DELETE_TO_ITEM:
    case DELETE_ALL_TO_ITEMS:
    case ADD_TO_EXTRA:
    case CHAGNE_TO_EXTRA:
    case INIT_PACKAGE:
        return {
            ...state,
            packageItems: action.payload,
            hasInitialed: true
        };
    default:
        return state;
    }
}
