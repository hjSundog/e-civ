export const ADD_MESSAGE = 'ADD_MESSAGE'
export const ADD_INVITATION = 'ADD_INVITATION'
export const CANCLE_INVITATION = 'CANCLE_INVITATION'
export const INIT_WEBSOCKET = 'INIT_WEBSOCKET'
export const REFUSE_INVITATION = 'REFUSE_INVITATION'
export const RECEIVE_INVITATION = 'RECEIVE_INVITATION'
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

export function cancle_invitation(data) {
    return {
        type: CANCLE_INVITATION,
        payload: {
            data
        }
    }
}

export function refuse_invitation(data) {
    return {
        type: RECEIVE_INVITATION,
        payload: {
            data
        }
    }
}

export function receive_invitation(data) {
    return {
        type: RECEIVE_INVITATION,
        payload: {
            data
        }
    }
}

export function init_websocket(ws) {
    return {
        type: INIT_WEBSOCKET,
        payload: {
            data: ws
        }
    }
}
