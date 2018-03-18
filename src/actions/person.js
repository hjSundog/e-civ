export const CREATE_PERSON  = 'CREATE_PERSON'
export const UPDATE_PERSON = 'UPDATE_PERSON'
export const DELETE_PERSON = 'DELETE_PERSON'
export const INIT_PERSON = 'INIT_PERSON'
export const RESET_PERSON = 'RESET_PERSON'
export const UPDATE_PERSON_POI = 'UPDATE_PERSON_POI'  // 更新人物地理位置

export function init_person(person) {
    return {
        type: INIT_PERSON,
        person
    }
}

export function reset() {
    return {
        type: RESET_PERSON,
    }
}

export function create_person(person) {
    return {
        type: CREATE_PERSON,
        person
    }
}

export function update_person(person) {
    return {
        type: UPDATE_PERSON,
        person
    }
}


export function delete_person() {
    return {
        type: DELETE_PERSON,
        person: {
            lon: 12.3,
            lat: 30,
        }
    }
}

export function update_person_poi(position) {
    return {
        type: UPDATE_PERSON_POI,
        position
    }
}
