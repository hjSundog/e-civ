import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import tpl2entity from '@/api/mock/utils/tpl2entity'
var normalAxios = axios.create();
var mockAxios = axios.create();

// mock 数据
var mock = new MockAdapter(mockAxios);

mock.onPost('/users/login').reply(config => {
    let postData = config.params;
    if (postData.username === 'admin' && postData.password === 'admin') {
        return [200, require('./mock/user') ];
    } else {
        return [422, {message: "Incorrect user or password"} ];
    }
});
mock.onGet('/logout').reply(200, {});
mock.onGet('/my').reply(200, require('./mock/user'));
mock.onGet('/menu').reply(200, require('./mock/menu'));
mock.onGet('/randomuser').reply((config) => {
    return new Promise(function(resolve, reject) {
        normalAxios.get('https://randomuser.me/api', {
            params: {
                results: 10,
                ...config.params,
            },
            responseType: 'json'
        }).then((res) => {
            resolve([200, res.data ]);
        }).catch((err) => {
            resolve([500, err ]);
        });
    });
});

// 获取聊天室的广播站(频道)
mock.onGet('/radioStation').reply(config => {
    if (config.debug === true) {
        return [200, require('./mock/radioStation') ];
    } else {
        return [404, {message: "当前位置没有广播站"} ];
    }
// mock.onGet(/\/users\/\d+/).reply(config => {
//     console.log('获取user角色')
//     console.log(config.url)
//     return [200, require('./mock/person')]
})

mock.onPost('/persons').reply(config => {
    let postData = JSON.parse(config.data);
    if(postData.name && postData.meta ) {
        return [200,{...require('./mock/person'),...postData}]
    } else {
        return [422, {message: "Incorrect user or password"} ];
    }
})

//获取角色物品
mock.onGet(/\/persons\/\w+\/items/).reply(config => {
    console.log(config)
    const items = require('./mock/item').filter(item => {
        return item.owner_id === 1
    }).map(item => {
        return tpl2entity(item)
    })

    if(items.length>0) {
        return [200, items]
    } else {
        return [404, {message: '没有任何物品'}]
    }
})

mock.onGet(/\/persons\/\w+/).reply(config => {
    console.log(config.url)
    return [200, require('./mock/person')]
})


mock.onGet('/building').reply(config => {
    const { id = 1 } = JSON.parse(config.data)
    console.log('building '+ id)
    const buildings = require('./mock/buillding')
    const dest = buildings.find(building => {
        return building._id === id
    })

    dest.guild === 1?dest.guild = 'sundog':'mdzz';
    dest.owner === 3?dest.owner = 'fuck':'mmp';
    if(dest){
        return [200,dest]
    }else {
        return [404, {message: "该坐标没有任何建筑"}]
    }
})
//获取某个物品
mock.onGet('/items').reply(config => {
    const {id = 1} = JSON.parse(config.data)

    const items = require('./mock/item')
    let dist = items.find(item => {
        return item._id === id
    })
    dist = tpl2entity(dist)
    if (dist) {
        return [200, dist]
    } else {
        return [404, {message: "没找到该物品"}]
    }
})

mock.onDelete('/items/').reply(config => {
    const { id = 1} = JSON.parse(config.data);

    return [200, {message: 'mdzz' + id}]
})
export default mockAxios;
