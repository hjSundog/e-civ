export const ADD_MESSAGE = 'ADD_MESSAGE'
export const ADD_INVITATION = 'ADD_INVITATION'
export const INIT_WEBSOCKET = 'INIT_WEBSOCKET'
export const CANCLE_INVITATION = 'CANCLE_INVITATION'
export const REFUSE_INVITATION = 'REFUSE_INVITATION'
export const RECEIVE_INVITATION = 'RECEIVE_INVITATION'
export const ADD_TRANSACTION = 'ADD_TRANSACTION'
export const CANCLE_TRANSACTION = 'CANCLE_TRANSACTION'
export const CHANGE_TRADINGWITH = 'CHANGE_TRADINGWITH'

// 更改交易对象
export function change_trade_target(target) {
    return {
        type: CHANGE_TRADINGWITH,
        payload: {
            data: target
        }
    }
}

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

export function add_transaction(data) {
    return {
        type: ADD_TRANSACTION,
        payload: {
            data
        }
    }
}


export function cancel_transaction(data) {
    return {
        type: CANCLE_TRANSACTION,
        payload: {
            data
        }
    }
}

export function cancel_invitation(data) {
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
