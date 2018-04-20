import service from './index'

export const getGameFrames = ({own, enemy}) => {
    return service.post('/game', {
        own,
        enemy
    })
}

// 游戏
export const sendFramesToServer = ({data}) => {
    return service.post(`/games/`, {
        ...data
    })
}