import service from './index'
import store from '@/store'
// import axios from 'axios'
// // 没有拦截器先这样做

// export const CreateCharacter = (person, token) => {
//     // service.
//     return axios({
//         method: 'post',
//         url: '/persons',
//         headers: {
//             'access-token': token
//         },
//         data: {
//             ...person
//         },
//         baseURL: process.env.BASE_API
//     })
// }

// export const CreateCharacter = (person) => {

//     return service.post(`/users/${store.getState().user.id}/persons`, {
//         ...person
//     })
// }

export const CreateCharacter = (person) => {
    return service.post(`/persons`, {
        ...person
    })
}

// 查询api
export const RetreiveCharacter = (id) => {
    return service.get(`/persons/${id}`)
}

export const UpdateCharacter = ({id, data}) => {
    return service.patch(`/persons/${id}`, {
        ...data
    })
}

// 删除api
export const DeleteCharacter = (id) => {
    return service.delete(`/persons/${id}`)
}

// 获取物品列表
export const GetItem = ({personId, itemId}) => {
    return service.get(`/persons/${personId}/items/${itemId}`)
}

// 获取所有物品
export const GetAllItems = (id) => {
    return service.get(`/persons/${id}/items`)
}

// 获取某类物品
export const GetItemsOf = ({id, type}) => {
    return service.get(`/persons/${id}/items?type=`, {
        params:{
            type: type
        }
    })
}

// 使用物品
export const UseItem = ({personId, itemId, count}) => {
    return service.delete(`/persons/${personId}/items/${itemId}`, {
        params: {
            count: count
        }
    })
}

// 创建物品
// item {type count}
export const CreateItem = ({id, item}) => {
    return service.post(`/persons/${id}/items`, {
        ...item
    })
}



