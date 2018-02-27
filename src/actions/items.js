// 交易数据 感觉这一部分放在websocket比较好
// 自己这边的物品数据
export const ADD_FROM_ITEM = 'ADD_FROM_ITEM'
export const DELETE_FROM_ITEM = 'DELETE_FROM_ITEM'
export const DELETE_ALL_FROM_ITEMS = 'DELETE_ALL_FROM_ITEMS'
export const CHAGNE_FROM_EXTRA = 'CHANGE_FROM_EXTRA'
export const EMPTY_FROM_ITEM = 'EMPTY_FROM_ITEM'
// 对面物品数据
export const ADD_TO_ITEM = 'ADD_TO_ITEM'
export const DELETE_TO_ITEM = 'DELETE_TO_ITEM'
export const DELETE_ALL_TO_ITEMS = 'DELETE_ALL_TO_ITEMS'
export const CHAGNE_TO_EXTRA = 'CHANGE_TO_EXTRA'
export const EMPTY_TO_ITEM = 'EMPTY_TO_ITEM'
// 背包数据
export const INIT_PACKAGE = 'INIT_PACKAGE'
export const ADD_PACKAGE_ITEMS = 'ADD_PACKAGE_ITEMS'
export const REMOVE_PACKAGE_ITEM = 'REMOVE_PACAKGE_ITEM'
export const REMOVE_PACKAGE_ITMES = 'REMOVE_PACAKGE_ITEMS'
export const USE_ITEM = 'USE_ITEM'

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

// package

export function init_package(items) {
    return {
        type: INIT_PACKAGE,
        payload: items
    }
}

export function add_package_items(items) {
    return {
        type: ADD_PACKAGE_ITEMS,
        payload: items
    }
}