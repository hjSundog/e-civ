export const ADD_MESSAGE = 'ADD_MESSAGE'
export const ADD_INVITATION = 'ADD_INVITATION'
export function add_message(data) {
    return {
        type: ADD_MESSAGE,
        payload: {
            data
        }
    }
}


export function add_invitation(data) {
    return {
        type: ADD_INVITATION,
        payload: {
            data
        }
    }
}

