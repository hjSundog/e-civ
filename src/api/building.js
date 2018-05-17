import service from './index'

export const CreateBuilding = ({type, lat, lon, name}) => {
    return service.post('/buildings/'+ type, {
        name,
        lat,
        lon
    })
}

// 游戏
export const GetAllBuildings = () => {
    return service.get(`/buildings`)
}