import service from './index'

export const login = ({username, password}) => {
    return service.post('/users/login', {
        username,
        password
    })
}

export const createCharacter = (person) => {
    return service.post('/users/createCharacter', {
        ...person
    })
}

export const signup = ({name, username, password, meta}) => {
    return service.post('/users', {
        name,
        username,
        password,
        meta,
    })
}
