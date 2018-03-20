// 物理攻击时无视目标的部分护甲，来自其他单位的物理伤害不会享受来自你的物理穿透效果。
// 护甲穿透分为比例穿透和定值穿透：
// 1.比例穿透：你的物理攻击在计算伤害时默认降低被攻击者一定百分比护甲；
// 2.定值穿透：你的物理攻击在计算伤害时默认降低被攻击者一定值的护甲，在其护甲低于你的护甲穿透时护甲减免伤害为0。
// 当你同时拥有固定和比例两种穿透时，先计算比例穿透，再计算固定穿透。
// 例：目标护甲为100，你有50%的比例护甲穿透和60定值穿透，当你攻击该目标时，目标护甲值先减少50%,剩余50，再受到60点护甲穿透，为0，你对他造成的伤害不会减少。
// 护甲的减少伤害公式：100/（100+护甲值）
import * as PIXI from 'pixi.js';
import _ from 'lodash';
import MakeAnimationLoop from '../utils/MakeAnimationLoop'
import noop from '@/utils/noop.js';

const Rectangle = PIXI.Rectangle;

class Solider {
    static primarity = 0;
    static SoldierType = 'Soldier';

    // cache 为空时在loadFrames中指定帧来源，为对象
    constructor(cache, ) {
        // 攻击范围
        this.attackArea = 1;
        // 移动速度
        this.speedX = 1;
        this.speedY = 1;
        // 攻击力
        this.ATK = 10;
        // 防御力
        this.DEF = 10;
        // 物理穿透
        this.Penetration = 10;
        // 精灵图标
        this.sprite = new PIXI.Sprite();
        this.cache = cache?cache:null;
        // 方向
        this.direction = 'R';
        // 状态设置
        // 动作状态
        this.animateState = {};     // 动画帧存储
        this.actions = {};          // 动作效果回调函数存储
        this.actionTypes = [];      // 注册的动作类型存储
        this.nowActionState = '';
        // 动作怔状态
        this.loopState = 0;
        this.maxLoopState = 4;
    }

    setAnimateState() {

    }

    

    moveUP(pix = 1){
        this.sprite.y -= pix;
    }

    moveDown(pix = 1) {
        this.sprite.y += pix;
    }

    moveLeft(pix = 1) {
        this.sprite.x -= pix;
    }

    moveRight(pix = 1) {
        this.sprite.x += pix;
    }

    // 初始化动作函数
    initAction(actionName) {
        this.actions[actionName] = noop;
    }

    // 注册行为函数
    // 指定某个行为的回调函数 {name: ,callback}
    // 指定一系列行为的回调
    // 指定一系列行为各自的回调
    setAction= (map, callback) => {
        const type = toString.call(map).slice(8, -1) ;
        if (type === 'Array') {
            map.forEach(_map=>{
                const _map_type = toString.call(_map.name).slice(8, -1);
                if (_map_type === 'Array') {
                    _map.name.forEach(name=>{
                        this._setAction(name, _map.callback?_map.callback:noop);
                    })
                }

                if (_map_type === 'String') {
                    this._setAction(_map.name, _map.callback?_map.callback:noop);
                }
            })
        }   

        if (type === 'String') {
            this._setAction(map, callback);
        }

        if (type === 'Object') {
            const _type = toString.call(map.name).slice(8, -1);
            if (_type === 'Array') {
                map.name.forEach(name=>{
                    this._setAction(name, map.callback?map.callback:noop);
                })
            }
            if (_type === 'String') {
                this._setAction(map.name, map.callback?map.callback:noop);
            }
        }
        return this;
    }



    // 以后考虑move,up而不是move@up
    _setAction(name, callback) {
        // 注册该动作
        this.actionTypes.push(name);
        // 注册其函数
        const actions = name.split('@');
        let pointer = this.actions;
        const length = actions.length;
        for (let i=0;i<length-1;i++) {
            pointer = pointer[actions[i]];
        }
        pointer[actions[length-1]] = callback;
        return this;
    }

    // 人物运动循环，激活人物
    active = () => {
        // 死循环的尝试所有动作，并根据
        if (!this.MAL) {
            return console.error('该对象没有加载到MakeAnimationLoop对象上')
        }

        if (!this.BattleGround) {
            return console.error('该对象没有加载到BattleGround对象上')
        }
        // 时间可能存在一点问题，存在补足或者缺失问题.
        setInterval(()=>{
            this.actionTypes.forEach(type=>{
                // this.BattleGround.makeChildrenActive(type);
                this.doAction(type);   
            })
        }, 1000/this.MAL.fps)
    }


    // 针对每种行为制作其动画,子动画使用@链接,MOVE@UP
    doAction = (actionType) => {
        this.MAL.stop();
        // action动画效果逻辑
        const actions = actionType.split('@');
        // 占用的帧
        const frames = actions.reduce((pre, next) => {
            return pre[next];
        }, this.animateState);
        // 调用的函数
        const actionFunc = actions.reduce((pre, next) => {
            return pre[next];
        }, this.actions);

        const type = toString.call(frames).slice(8, -1);
        type === 'Array'
        ?this.MAL.animate(frames, actionFunc)
        :this.MAL.changeFrame(frames, actionFunc);
        // action实际效果逻辑
        // 这里做个适配吧
        // MOVE@UP,(MOVE,UP)都可以，推荐MOVE@UP
        // actionFunc(this);
        // actionFunc.call(this, this);
    }

    // 改变当前精灵的贴图
    // 可指定雪碧图中某个特定的帧
    // 也可指定state中某个子帧集中某个特别的帧
    changeFrame(actionType, id) {
        const actions = actionType.split('@');
        const frames = actions.reduce((pre, next) => {
            return pre[next];
        }, this.animateState);
        // 做个输入参数的判断吧
        const type = toString.call(frames).slice(8, -1);
        if (type === 'Array') {
            id?this.MAL.changeFrame(frames[id]):console.error('请输入指定的帧数id');
        }

        if (type === 'Object') {
            frames instanceof PIXI.Texture?this.MAL.changeFrame(frames):console.error('请输入正确的行为参数');
        }
    }


    // 加载帧
    // frames为路径数组或者路径或者undefined(此时必须制定src),
    // 所以只有两种情况，frames有时srcID没有值, frames没有值时，srcID有值
    loadFrames(actionType, rowNum = 1 , colNum = 1, frames, srcID) {
        //this.MAL.loadFrames
        let loadedFrames;
        const type = toString.call(frames).slice(8, -1);
        const actions = actionType.split('.');
        if (frames) {
            loadedFrames = this.MAL.loadFrames(frames, rowNum, colNum);
            actions.forEach(action=>{
                this.animateState[action] = {};
                this.animateState[action]['base'] = loadedFrames;
            })
        } else {
            loadedFrames = this.MAL.loadFrames(this.cache, rowNum, colNum, srcID);
            actions.forEach(action=>{
                this.animateState[action] = {};
                this.animateState[action]['base'] = loadedFrames;
            })
        }
        return this;
    }

    // state制定每个动作所需要的动画帧
    setState(callback) {
        const frames = this.MAL.getFrames();
        const state = callback.call(this, this);
        const MAL = this.MAL;
        function recurse(obj, dist, actions, mapFunc) {
            for (let key of Object.keys(obj)) {
                let type = toString.call(obj[key]).slice(8, -1);
                if (type === 'Object') {
                    dist[key] = {...dist[key]};
                    actions[key] = {};
                    recurse(obj[key], dist[key], actions[key], mapFunc);
                } else {
                    actions[key] = noop;
                    dist[key] = mapFunc(obj[key], dist.base);
                }
            }
        }
        // 根据state(数据)映射到animateState(帧)和动作函数
        recurse(state, this.animateState, this.actions, (val, base)=>{
            let type = toString.call(val).slice(8, -1);
            let sequences = val;
            if (type === 'Array') {
                sequences = {
                    start: val[0],
                    end: val[1]
                }
                return MAL.getSequenceFrames([sequences], base);
            }
            return MAL.getSequenceFrames([sequences], base)[0];
        })

        // 初始化动作函数
        // 初始化INIT
        this.sprite.texture = this.animateState['INIT'];
        console.log(this.animateState);
    }

    // 指定初始化帧，指定精灵位置，指定精灵交互情况,如果你有特定的初始帧可以在回调函数中
    // 指定，否则输入帧序数，该初始化会在loadFrames之后进行
    init(x, y, interactiveable, callback) {
        // 动画管理对象
        this.MAL = new MakeAnimationLoop(this.sprite);
        this.MAL.owner = this;
        // 初始化精灵
        this.setPosition(x, y);
        // 相应事件
        if (interactiveable) {
            this.sprite.interactive = true;
            this.sprite.buttonMode = true;   
        }
        const that = this;
        this.sprite.on('pointerdown', () => {
            switch (that.direction) {
                case 'U':
                    that.doAction('TURN@RIGHT')
                    that.turnTo('R');
                    break;
                case 'R':
                    that.doAction('TURN@DOWN');
                    that.turnTo('D');
                    break;
                case 'D':
                    that.doAction('MOVE@LEFT');
                    that.turnTo('L');
                    break;
                case 'L':
                    that.doAction('MOVE@UP');
                    that.turnTo('U');
                    break;
                default:
                    return;
            }
        });

        return this;
    }
    // 设置位置
    setPosition(x = 0, y = 0) {
        if (typeof x === 'object') {
            this.sprite.x = x.x;
            this.sprite.y = x.y;
        } else {
            this.sprite.x = x;
            this.sprite.y = y;
        }
    }
    // 转向
    turnTo(direction) {
        console.log('ture to: ' + direction);
        this.direction = direction;
        // this.changeFrame(this.direction, this.texture);
        // this.sprite.texture = this.texture;
        //this.sprite.texture.update();
    }

    // 将该对象加入容器中
    addToScene(scene) {
        console.log(this.SoldierType + '加入战场');
        scene.addChild ? scene.addChild(this.sprite) : console.error('加入的不是容器，请检查其类型');
    }
}

export default Solider