module.exports = {
    _id: 1,
    name: 'init person',
    id: 'asd-wfqasd',
    attributes: {
        str: 1,
        dex: 1,
        con: 1,
        int: 1,
        wis: 1,
        cha: 1
    },
    items: [],
    des: '这里使用redux比较好吧',
    conditions: {
        health: 100,
        maxHealth: 100,
        stamina: 100,
        maxStamina: 100
    },
    status: [],
    meta: {
        age: 0,
        sex: 'male'
    },
    state: 'available',  // 暂定三个状态 available, moving, doing
    position: {  // 当前经纬度位置
        lon: 12.3,
        lat: 30,
    },
}
