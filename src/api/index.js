var axios = require('axios');
var MockAdapter = require('axios-mock-adapter');
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


mock.onGet(/\/persons\/\w+/).reply(config => {
    console.log(config.url)
    return [200, require('./mock/person')]
})

export default mockAxios;
