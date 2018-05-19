import service from './index'

export const getResourcesList = () => {
    return service.get('/map/relative/resources', {})
}
