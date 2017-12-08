export const SET_USER = 'SET_USER'
export const REMOVE_USER = 'REMOVE_USER';

export function set_user(user) {
    return {
        type: SET_USER,
        payload: {
            user
        }
    }
}

export function remove_user() {

    return {
        type: REMOVE_USER,
        payload: {

        }
    }
}
