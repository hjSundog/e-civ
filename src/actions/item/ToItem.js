// 对面物品数据
export const ADD_TO_ITEM = 'ADD_TO_ITEM'
export const DELETE_TO_ITEM = 'DELETE_TO_ITEM'
export const DELETE_ALL_TO_ITEMS = 'DELETE_ALL_TO_ITEMS'
export const CHAGNE_TO_EXTRA = 'CHANGE_TO_EXTRA'
export const EMPTY_TO_ITEM = 'EMPTY_TO_ITEM'

// to
export function add_to_item(item) {
    return {
        type: ADD_TO_ITEM,
        payload: item
    }
}

export function empty_to_item() {
    return {
        type: EMPTY_TO_ITEM
    }
}

export function delete_to_item(item) {
    return {
        type: DELETE_TO_ITEM,
        payload: item
    }
}

export function change_to_extra(item) {
    return {
        type: CHAGNE_TO_EXTRA,
        payload: item
    }
}