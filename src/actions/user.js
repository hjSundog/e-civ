export const SET_USER = 'SET_USER'
export const CLEAR_USER = 'REMOVE_USER';
export const UPDATE_USER = 'UPDATE_USER'

export function set_user(user) {
    return {
        type: SET_USER,
        payload: {
            user
        }
    }
}

export function update_user(user) {
    return {
        type: UPDATE_USER,
        payload: {
            user
        }
    }
}

export function clear_user() {

    return {
        type: CLEAR_USER,
        payload: {
        }
    }
}
