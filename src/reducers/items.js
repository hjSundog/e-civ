import {
    // from 
    ADD_FROM_ITEM,
    EMPTY_FROM_ITEM,
    DELETE_FROM_ITEM,
    DELETE_ALL_FROM_ITEMS,
    CHAGNE_FROM_EXTRA,
    // to
    ADD_TO_ITEM,
    EMPTY_TO_ITEM,
    DELETE_TO_ITEM,
    DELETE_ALL_TO_ITEMS,
    CHAGNE_TO_EXTRA,
    // package
    INIT_PACKAGE,
    ADD_PACKAGE_ITEMS,
    SET_PACKAGE,
    // auction
    INIT_AUCTION,
    SELL_TO_AUCTION,
    BUY_FROM_AUCTION,
    MAKING_BID,
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
    auctionItems: {
        sellItems: [],
        makingBidItems: [],
        totalItems: []
    },
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
    case SET_PACKAGE:
        return {
            ...state,
            packageItems: action.payload
        }
    case ADD_PACKAGE_ITEMS:
        return {
            ...state,
            packageItems: [...state.packageItems, ...action.payload]
        }
    case INIT_AUCTION: {
        return {
            ...state,
            auctionItems: {
                ...state.auctionItems,
                totalItems: action.payload
            }
        }
    }
    case SELL_TO_AUCTION: {
        return {
            ...state,
            auctionItems: {
                ...state.auctionItems,
                sellItems: [...state.auctionItems.sellItems, ...action.payload]
            }
        }
    }
    case MAKING_BID: {
        const target = action.payload;
        const totalItems = state.auctionItems.totalItems;
        const index = totalItems.findIndex(item => {
            return item.id === target.id
        })
        if (index < 0) {
            return state
        }
        totalItems[index] = {...totalItems[index], ...target}
        return {
            ...state,
            auctionItems: {
                ...state.auctionItems,
                makingBidItems: [...state.auctionItems.makingBidItems, ...action.payload]
            }
        }
    }
    default:
        return state;
    }
}
