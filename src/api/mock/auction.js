// 不采用websocket方式更新，采取每次加载的时候更新
// 数据结构
// making_bid:
// {
//     target: 目标拍卖品id,
//     from: {
//         name: '竞拍者姓名',
//         price: '竞拍价格',
//         avatar:  '竞拍者头像'
//     }
// }
//
// sell_to_auction:
// {
//     from: {
//         name: 拍卖者姓名，
//         price: 低价,
//         avatar: '拍卖者头像',
//     },
//     item: {
//         拍卖物品
//     },
//     limitedTime: {
//         startTime:
//         endTime
//     }
// }


module.exports = [{
    _id: 0,
    owner_id: 'admin',
    owner_avatar: '',
    name: 'gold apple',
    type: 'consumable',
    icon: '',
    details: {
        type: 'Food',
        apply_count: 1
    },
    endTime: 1525449600000,
    startTime: 1515340800000,
    auctioner: {
        name: 'break',
        price: 23,
        avatar: ''
    }
},{
    _id: 1,
    owner_avatar: '',
    owner_id: 'lvfei',
    name: 'sliver apple',
    type: 'consumable',
    icon: '',
    details: {
        type: 'Food',
        apply_count: 1
    },
    endTime: 1525449600000,
    startTime: 1515340800000,
    auctioner: {
        name: 'mdzz',
        price: 79,
        avatar: ''
    }
},{
    _id: 2,
    owner_id: 'guest',
    owner_avatar: '',
    name: 'apple',
    type: 'consumable',
    icon: '',
    details: {
        type: 'Food',
        apply_count: 1
    },
    endTime: 1525449600000,
    startTime: 1515340800000,
    auctioner: {
        name: 'ioio',
        price: 78,
        avatar: ''
    }
},{
    _id: 3,
    owner_id: 'lwio',
    owner_avatar: '',
    name: 'bad apple',
    type: 'consumable',
    icon: '',
    details: {
        type: 'Food',
        apply_count: 1
    },
    endTime: 1525449600000,
    startTime: 1515340800000,
    auctioner: {
        name: 'inferno',
        price: 45,
        avatar: ''
    }
}]
