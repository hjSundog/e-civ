import Path from 'path'
/**
 * 实现将一个不完全的实体根据tpl 转为一个完整的实体
 */
const defaultEntity = {
    type: 'consumable',
    name: 'apple',
    details: {
        type: 'Food',
    }
}

const defaultExtract = ['description', 'rarity', 'vendor_value', 'effect', 'recipe', 'ingredient']
const targets = require('../ItemTpl/ConsumableTpl/FoodTpl');
const defaultPath = '../ItemTpl/'

function toUpperCaseFirst(word) {
    const wa = word.split('');
    const rt = wa.splice(0,1)[0].toUpperCase()+wa.join('');
    return rt;
}
//省略指定的属性
function omit(omit) {
    const temp = [].concat(defaultExtract);
    for(let t of omit) {
        temp.splice(temp.findIndex((target) => {
            return target === t
        }),1)
    }
 
}

export default function tpl2entity(part = defaultEntity,extract = defaultExtract) {
    //路径先写死 马丹好像require不能写表达式，只能字符串
    const { type, details, name} = part

    // const path = Path.normalize(`${defaultPath}/${toUpperCaseFirst(type)}Tpl/${toUpperCaseFirst(details.type)}Tpl`)
    
    const dist = targets.filter(target => {
        return target.name === name
    })
    const t = extract.reduce((pre, cur) => {
        typeof pre[cur] === 'undefined'? pre[cur] = dist[0][cur]: pre
        return pre
    }, {})
    return {...part, ...t};
}
