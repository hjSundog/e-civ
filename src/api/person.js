//import service from './service'
import axios from 'axios'
// 没有拦截器先这样做

export const avatarUrl = process.env.BASE_API + '/persons/avatar'

export const createCharacter = (person, token) => {
    // service.
    return axios({
        method: 'post',
        url: '/persons',
        headers: {
            'access-token': token
        },
        data: {
            ...person
        },
        baseURL: process.env.BASE_API
    })
}
// export const createCharacter = (person) => {
//     // service.
//     return service.post('/persons', {
//         ...person
//     })
// }