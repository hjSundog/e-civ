import service from './service'

export const getGameFrames = ({own, enemy}) => {
    return service.post('/game', {
        own,
        enemy
    })
}