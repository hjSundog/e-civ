import api from '../api'

export const SET_USER = 'SET_USER'
export const REMOVE_USER = 'REMOVE_USER';

export function login({username, password}) {
    return {
        type: 'LOGIN',
        payload: {
            promise: api.post('/login', {
                data: {
                    username,
                    password
                }
            })
        }
    }
}

export function logout() {

    return {
        type: 'REMOVE_USER',
        payload: {

        }
    }
}
