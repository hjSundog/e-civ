export const ADD_MESSAGE = 'ADD_MESSAGE'

export function add_message(data) {
    return {
        type: ADD_MESSAGE,
        payload: {
            data
        }
    }
}
