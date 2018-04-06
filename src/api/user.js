import service from './service'

export const login = ({username, password}) => {
    return service.post('/users/login', {
        username,
        password
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
