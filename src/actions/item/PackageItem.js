// 背包数据
export const INIT_PACKAGE = 'INIT_PACKAGE'
export const ADD_PACKAGE_ITEMS = 'ADD_PACKAGE_ITEMS'
export const REMOVE_PACKAGE_ITEM = 'REMOVE_PACAKGE_ITEM'
export const REMOVE_PACKAGE_ITMES = 'REMOVE_PACAKGE_ITEMS'
export const USE_ITEM = 'USE_ITEM'

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