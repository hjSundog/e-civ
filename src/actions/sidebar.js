export const CHANGE_ATTRIBUTE = 'CHANGE_ATTRIBUTE';
export const INIT_SIDEBAR = 'INIT_SIDEBAR';
export const CHANGE_STATE = 'CHANGE_STATE';
//先来个笼统的就好
export function change_state(newState) {
    return {
        type: CHANGE_STATE,
        state: newState
    }
}

export function change_attribute(newAttribute) {

    return {
        type: CHANGE_ATTRIBUTE,
        attributes: newAttribute
    }
}

export function reset() {
    return {
        type: INIT_SIDEBAR
    }
}
