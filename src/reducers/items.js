import {
    ADD_FROM_ITEM,
    EMPTY_FROM_ITEM,
    DELETE_FROM_ITEM,
    DELETE_ALL_FROM_ITEMS,
    CHAGNE_FROM_EXTRA,
    ADD_TO_ITEM,
    EMPTY_TO_ITEM,
    DELETE_TO_ITEM,
    DELETE_ALL_TO_ITEMS,
    CHAGNE_TO_EXTRA,
    INIT_PACKAGE,
    ADD_PACKAGE_ITEMS,
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
    case EMPTY_FROM_ITEM: 
        return {
            ...state,
            fromItems: {
                payload: [],
                extra: []
            }
        }
    case DELETE_FROM_ITEM:
    case DELETE_ALL_FROM_ITEMS:
    case CHAGNE_FROM_EXTRA:
    case ADD_TO_ITEM:
        return {
            ...state,
            toItems: {
                ...state.toItems,
                payload: [...state.toItems.payload, ...action.payload]
            }
        };
    case EMPTY_TO_ITEM: 
        return {
            ...state,
            toItems: {
                payload: [],
                extra: []
            }
        }
    case DELETE_TO_ITEM:
    case DELETE_ALL_TO_ITEMS:
    case CHAGNE_TO_EXTRA:
    case INIT_PACKAGE:
        return {
            ...state,
            packageItems: action.payload,
            hasInitialed: true
        };
    case ADD_PACKAGE_ITEMS:
        return {
            ...state,
            packageItems: [...state.packageItems, ...action.payload]
        }
    default:
        return state;
    }
}
