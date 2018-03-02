// 自己这边的物品数据
export const ADD_FROM_ITEM = 'ADD_FROM_ITEM'
export const DELETE_FROM_ITEM = 'DELETE_FROM_ITEM'
export const DELETE_ALL_FROM_ITEMS = 'DELETE_ALL_FROM_ITEMS'
export const CHAGNE_FROM_EXTRA = 'CHANGE_FROM_EXTRA'
export const EMPTY_FROM_ITEM = 'EMPTY_FROM_ITEM'

// from
export function add_from_item(item) {
    return {
        type: ADD_FROM_ITEM,
        payload: item
    }
}

export function delete_from_item(item) {
    return {
        type: DELETE_FROM_ITEM,
        payload: item
    }
}

export function empty_from_item() {
    return {
        type: EMPTY_FROM_ITEM
    }
}

export function change_from_extra(item) {
    return {
        type: CHAGNE_FROM_EXTRA,
        payload: item
    }
}