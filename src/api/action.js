import service from './index'

export const move = ({lon, lat}) => {
    return service.post('/actions/walk', {
        lon: lon,
        lat: lat
    })
}
