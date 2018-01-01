module.exports = [{
    _id: 0,
    name: 'gold apple',
    icon: '',
    rarity: 'masterwork',
    vendor_value: 50,
    level: 50,
    effect: {
        hp: 80
    },
    description: '金灿灿的苹果，可以回复大量生命值',
    recipe: [{
        ingredient: 'sliver apple',
        count: 1
    },{
        ingredient: 'apple',
        count: 3
    }]
},{
    _id: 1,
    name: 'sliver apple',
    icon: '',
    rarity: 'fine',
    level: 20,
    vendor_value: 30,
    effect: {
        hp: 40
    },
    description: '银闪闪的苹果，可以回复较多生命值',
    recipe: [{
        ingredient: 'apple',
        count: 5
    }],
    ingredient: 'gold apple'
},{
    _id: 2,
    name: 'apple',
    icon: '',
    rarity: 'Basic',
    level: 5,
    vendor_value: 10,
    effect: {
        hp: 10
    },
    description: '红彤彤的苹果，可以回复少量生命值',
    ingredient: ['sliver apple', 'gold apple']
}]
