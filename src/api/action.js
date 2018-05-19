import service from './index'

export const move = ({lon, lat}) => {
    return service.post('/action/move', {
        target: {
            lon: lon,
            lat: lat
        }
    })
}
