import service from './index'

export const getLetters = () => {
    return service.get('/letters', {})
}

export const postLetters = ({title, content, toUserId}) => {
    return service.post('/letters', {
        title,
        content,
        to_user_id: toUserId
    })
}

export const getLetter = (id) => {
    return service.get('/letters', {
        params: {
            id
        }
    })
}
