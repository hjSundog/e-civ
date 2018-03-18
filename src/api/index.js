import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import tpl2entity from '@/api/mock/utils/tpl2entity'
var normalAxios = axios.create();
var mockAxios = axios.create();

// mock 数据
var mock = new MockAdapter(mockAxios);

mock.onPost('/users/login').reply(config => {
    let postData = config.params;
    if ((postData.username === 'admin' && postData.password === 'admin') || (postData.username === 'guest' && postData.password === 'guest')) {
        if (postData.username === 'admin') {
            return [200, require('./mock/user')[0]];
        } else {
            return [200, require('./mock/user')[1]]
        }
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
    const reg = /\/persons\/(\w+)\/items/;
    const target = config.url.match(reg)[1];
    console.log('config is: '+target)
    const items = require('./mock/item').filter(item => {
        return item.owner_id === target
    }).map(item => {
        return tpl2entity(item)
    })

    if(items.length>0) {
        return [200, items]
    } else {
        return [404, {message: '没有任何物品'}]
    }
})

mock.onGet(/\/persons\/[\w-]+\/skills/).reply(config => {
    return [200, {
        skills: [{
            name: 'cultivate',
            desc: '春种一粒粟，秋收万颗子。',
            icon: 'skill-cultivate',
            display: '种植',
            level: 1,
            EXP: 30.3, // 百分比
            maxEXP: 100,

            type: 'life',
            isPassive: false,
            facts: [{   // 这里只用于显示效果，实际操作以服务器返回为准
                text: '体力下降',
                type: 'AttributeAdjust',
                value: 20,
                target: 'health'
            }, {
                text: '熟练度提升',
                type: 'SkillEXP',
                value: 10,
                target: 'cultivate'
            }]
        }, {
            name: 'walk',
            desc: '徒步旅行很惬意',
            icon: 'skill-walk',
            display: '徒步',
            level: 1,
            EXP: 10,
            maxEXP: 100,

            type: 'life',
            isPassive: true
        }]
    }]
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

// person使用技能， 返回person对象
mock.onPost(/\/skills\/\w+\/use/).reply(config => {
    const reg = /\/persons\/(\w+)\/items/;

    return [200, {
        person: {   // 对person的影响，直接返回整个person对象。
            _id: 1,
            name: 'test',
            id: 'oier-133ao',
            attributes: {
                str: 1,
                dex: 1,
                con: 1,
                int: 1,
                wis: 1,
                cha: 1
            },
            items: [],
            des: '我不是一个逗逼，真的',
            conditions: {
                health: 50,
                maxHealth: 100,
                stamina: 100,
                maxStamina: 100
            },
            status: [],
            meta: {
                age: 0,
                sex: 'male'
            }
        },
        skills: [{  // 对skill的影响， 返回有变化的整个skill对象
            name: 'cultivate',
            desc: '春种一粒粟，秋收万颗子。',
            icon: 'skill-cultivate',
            display: '种植',
            level: 1,
            EXP: 60.3, // 百分比
            maxEXP: 100,

            type: 'life',
            isPassive: false,
            facts: [{   // 这里只用于显示效果，实际操作以服务器返回为准
                text: '体力下降',
                type: 'AttributeAdjust',
                value: 20,
                target: 'health'
            }, {
                text: '熟练度提升',
                type: 'SkillEXP',
                value: 10,
                target: 'cultivate'
            }]
        }]
    }]
})


mock.onGet('/items/auction').reply(config => {
    //const {id = 1} = JSON.parse(config.data)

    const items = require('./mock/auction')
    const dist = items.map(item => {
        return tpl2entity(item)
    });
    if (dist) {
        return [200, dist]
    } else {
        return [404, {message: "没有拍卖物品"}]
    }
})

export default mockAxios;
