import service from './index'

export const getGameFrames = ({own, enemy}) => {
    return service.post('/game', {
        own,
        enemy
    })
}