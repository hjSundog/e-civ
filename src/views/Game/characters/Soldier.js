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

// const Rectangle = PIXI.Rectangle;

const HEALTH_WIDTH = 30;
const HEALTH_HEIGHT = 3;

class Solider {
    static primarity = 0;
    static SoldierType = 'Soldier';

    // cache 为空时在loadFrames中指定帧来源，为对象
    constructor(cache, blood) {
        // 生命值
        this.blood = blood;
        this.maxBlood = blood;
        // 攻击范围
        this.attackArea = 1;
        // 移动速度
        this.speedX = 10;
        this.speedY = 10;
        // 攻击力
        this.ATK = 10;
        // 防御力
        this.DEF = 10;
        // 物理穿透
        this.Penetration = 10;
        // 精灵图标
        this.sprite = new PIXI.Sprite();
        this.displayEntity = new PIXI.Container();
        this.cache = cache ? cache : null;
        // 方向
        this.direction = 'RIGHT';
        // 状态设置
        // 动作状态
        this.animateState = {}; // 动画帧存储
        this.actions = {}; // 动作效果回调函数存储
        this.actionTypes = ['MOVE@UP', 'MOVE@DOWN', 'MOVE@LEFT', 'MOVE@RIGHT']; // 注册的动作类型存储
        this.steps = []; // 该对象从开始到最后经历的动作集合
        this.maxStepLength = 50; // 默认最多的步骤为50步
        this.lastStep = ''; // 上一步
        this.nowActionState = '';
        // 动作怔状态
        this.loopState = 0;
        this.maxLoopState = 4;
        // 是否存活
        this.isLive = true;
        // 组名
        this.group = '';
        // 敌人
        this.enemy = null;
        // 用于判断是否是上次的敌人，以确保目标，最好的方法是为每个敌人设置一个id
        this.lastEnemy = null;
        // 受到的攻击者
        this.attackedBy = [];
        // 远程对象
        // 是否是间接伤害
        this.isShotType = false;
        this.shotItems = [];
        // 初始化可见对象
        this._init();
    }

    _init() {
        this._createBloodState(this.blood);
        this.displayEntity.addChild(this.sprite);
        this.displayEntity.addChild(this.healthBar);
    }

    // 制作血条
    _createBloodState = (blood) => {
        const healthBar = new PIXI.Container();
        //const {x, y} = this.getPosition();
        healthBar.position.set(0, 10);
        //Create the black background rectangle
        let innerBar = new PIXI.Graphics();
        innerBar.beginFill(0xff1c1c);
        innerBar.drawRect(0, 0, HEALTH_WIDTH, HEALTH_HEIGHT);
        innerBar.endFill();
        healthBar.addChild(innerBar);

        //Create the front red rectangle
        let outerBar = new PIXI.Graphics();
        outerBar.beginFill(0x31d255);
        outerBar.drawRect(0, 0, HEALTH_WIDTH, HEALTH_HEIGHT);
        outerBar.endFill();
        healthBar.addChild(outerBar);
        healthBar.outer = outerBar;

        this.healthBar = healthBar;
    }
    // 获取真正的血条
    getHealthBar() {
        return this.healthBar.outer;
    }

    setHealthBar(len) {
        this.healthBar.outer.width = len;
    }

    // 受到攻击
    attacked = (enemy, hurt) => {
        this.blood -= hurt;
        const percent = this.blood / this.maxBlood;
        this.setHealthBar(HEALTH_WIDTH * percent);
        // console.log('受到来自'+enemy.SoldierType+'的攻击,损失'+hurt+'点血量！');
        // this.SoldierType === 'Archer' ? console.log('Archer只剩%s点血量了', this.blood) : console.error('ThiefHead只剩%s点血量了', this.blood);
        if (this.blood <= 0 && this.getLiveState()) {
            this.setLiveState(false);
        }
    }



    // 计算伤害值
    computeHurt(ATK, Penetration, DEF) {
        const actualDEF = DEF - Penetration > 0 ? DEF - Penetration : 0;
        return ATK - actualDEF > 0 ? ATK - actualDEF : 1;
    }

    // 停止射击
    stopShot() {
        this.MAL.stop();
    }

    // 射击类间接伤害
    _shot = (enemy) => {
        return enemy;
    }

    // 停止攻击
    // 停止内部循环函数
    stopAttack() {
        // this.MAL.stop();
        // console.log(this.SoldierType + ' stop attack');
        this.MAL.stop();
    }

    attack = (enemy) => {
        if (this.isShotType) {
            this._shot(enemy);
        } else {
            this._attack(enemy);
        }
    }

    // 攻击,直接伤害
    _attack = (enemy) => {
        // 转向目标
        const directions = this._judgeDirection(enemy);
        if (!directions.includes(this.direction)) {
            this.direction = directions[Math.floor(Math.random()*directions.length)];
        }
        // 判断是否是同意敌人
        if (this.lastEnemy !== enemy) {
            this.doAction('ATTACK@' + this.direction, false, () => {
                const {
                    ATK,
                    Penetration
                } = this;
                const {
                    DEF
                } = enemy;
                const hurt = this.computeHurt(ATK, Penetration, DEF);
                enemy.attacked(this, hurt);
            }, true);
            this.lastEnemy = enemy;
            return this;
        }
        this.doAction('ATTACK@' + this.direction, false, () => {
            const {
                ATK,
                Penetration
            } = this;
            const {
                DEF
            } = enemy;
            const hurt = this.computeHurt(ATK, Penetration, DEF);
            enemy.attacked(this, hurt);
        });
        return this;
    }

    getSprite() {
        return this.sprite;
    }

    setLiveState(state) {
        this.isLive = state;
    }

    getLiveState() {
        return this.isLive;
    }

    die = () => {
        this.doAction('DEAD', false, ()=>{
        // 清除自己的定时器
            console.log(this.groupName + ' 的 ' + this.SoldierType + ' died!...');
            // test
            const bg = this.BattleGround;
            console.log('my方还有%s个人，enemy方还有%s个人!', bg['groups']['my'].length, bg['groups']['enemy'].length);
            // test

            this.stop();
            this.isLive = false;
            this.sprite.destroy();
            this.displayEntity.destroy();
            // 移除战场
            this.BattleGround.removeChild(this);
            // 移除攻击者目标
            this.attackedBy.forEach(attacker => {
                attacker.stopAttack();
                attacker.enemy = null;
            })
            this.destroy();
        });
    }

    destroy() {
        // this = undefined;
        // console.log('destroy is contructing...');
    }

    initSpeed() {
        this.speedX = 10;
        this.speedY = 10;
    }

    setSpeed(x, y) {
        if (typeof x === 'object') {
            this.speedX = x.vx;
            this.speedY = x.vy;
        } else {
            this.speedX = x;
            this.speedY = y;
        }
    }

    setSpeedX(vx) {
        this.speedX = vx;
    }

    setSpeedY(vy) {
        this.speedY = vy;
    }

    moveUP(pix) {
        const DIRECTION = 'UP';
        if (pix) {
            this.setSpeed(this.speedX, pix);
        }
        // const bounds = this.BattleGround.getChildForbiddenDirection(this);
        // // 如果不允许往上走则向其他方向移动
        // if (bounds.includes(DIRECTION)) {
        //     this.moveRight();
        //     return this;
        // }
        //this.sprite.y -= this.speedY;
        this.displayEntity.y -= this.speedY;
        this.turnTo('UP');
    }

    moveDown(pix) {
        const DIRECTION = 'DOWN';
        if (pix) {
            this.setSpeed(this.speedX, pix);
        }
        // const bounds = this.BattleGround.getChildForbiddenDirection(this);
        // // 如果不允许往上走则向其他方向移动
        // if (bounds.includes(DIRECTION)) {
        //     this.moveLeft();
        //     return this;
        // }
        // this.sprite.y += this.speedY;
        this.displayEntity.y += this.speedY;
        this.turnTo('DOWN');
    }

    moveLeft(pix) {
        const DIRECTION = 'LEFT';
        if (pix) {
            this.setSpeed(pix, this.speedY);
        }
        // const bounds = this.BattleGround.getChildForbiddenDirection(this);
        // // 如果不允许往上走则向其他方向移动
        // if (bounds.includes(DIRECTION)) {
        //     this.moveUP();
        //     return this;
        // }
        //this.sprite.x -= this.speedX;
        this.displayEntity.x -= this.speedX;
        this.turnTo('LEFT');
    }

    moveRight(pix) {
        const DIRECTION = 'RIGHT';
        if (pix) {
            this.setSpeed(pix, this.speedY);
        }
        // const bounds = this.BattleGround.getChildForbiddenDirection(this);
        // // 如果不允许往上走则向其他方向移动
        // if (bounds.includes(DIRECTION)) {
        //     this.moveDown();
        //     return this;
        // }
        // this.sprite.x += this.speedX;
        this.displayEntity.x += this.speedX;
        this.turnTo('RIGHT');
    }


    // 初始化动作函数
    initAction(actionName) {
        this.actions[actionName] = noop;
    }

    // 注册行为函数
    // 指定某个行为的回调函数 {name: ,callback}
    // 指定一系列行为的回调
    // 指定一系列行为各自的回调
    setAction = (map, callback) => {
        const type = toString.call(map).slice(8, -1);
        if (type === 'Array') {
            map.forEach(_map => {
                const _map_type = toString.call(_map.name).slice(8, -1);
                if (_map_type === 'Array') {
                    _map.name.forEach(name => {
                        this._setAction(name, _map.callback ? _map.callback : noop);
                    })
                }

                if (_map_type === 'String') {
                    this._setAction(_map.name, _map.callback ? _map.callback : noop);
                }
            })
        }

        if (type === 'String') {
            this._setAction(map, callback);
        }

        if (type === 'Object') {
            const _type = toString.call(map.name).slice(8, -1);
            if (_type === 'Array') {
                map.name.forEach(name => {
                    this._setAction(name, map.callback ? map.callback : noop);
                })
            }
            if (_type === 'String') {
                this._setAction(map.name, map.callback ? map.callback : noop);
            }
        }
        return this;
    }

    // 以后考虑move,up而不是move@up
    _setAction(name, callback) {
        // 注册该动作
        this.actionTypes.includes(name) ? null : this.actionTypes.push(name);
        // 注册其函数
        const actions = name.split('@');
        let pointer = this.actions;
        const length = actions.length;
        for (let i = 0; i < length - 1; i++) {
            pointer = pointer[actions[i]];
        }
        pointer[actions[length - 1]] = callback;
        return this;
    }

    // 人物静止
    stop = () => {
        clearInterval(this.timer);
        // 停止动作
        this.MAL.stop();
    }

    // 人物运动循环，激活人物
    active = () => {
        if (!this.MAL) {
            return console.error('该对象没有加载到MakeAnimationLoop对象上')
        }

        if (!this.BattleGround) {
            return console.error('该对象没有加载到BattleGround对象上')
        }
        // 时间可能存在一点问题，存在补足或者缺失问题.
        this.timer = setInterval(() => {
            this.BattleGround.makeChildrenActive(this);
        }, 10)
    }


    // 针对每种行为制作其动画,子动画使用@链接,MOVE@UP
    doAction = (actionType, once, cb, reset = false) => {
        // 当前对象行为和上次一样则直接跳过逻辑，继续以当前状态运行
        if (this.lastStep === actionType && !reset) {
            return;
        }
        // console.log('reset action');
        // 保存改步骤
        this.steps.push(actionType);
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
        type === 'Array' ?
            (once ? this.MAL.animateOnce(actionType, frames, actionFunc, cb) : this.MAL.animate(actionType, frames, actionFunc, cb)) :
            this.MAL.changeFrame(frames, actionFunc);

        this.lastStep = actionType;
        return this;
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
            id ? this.MAL.changeFrame(frames[id]) : console.error('请输入指定的帧数id');
        }

        if (type === 'Object') {
            frames instanceof PIXI.Texture ? this.MAL.changeFrame(frames) : console.error('请输入正确的行为参数');
        }
    }
    // 加载帧
    // frames为路径数组或者路径或者undefined(此时必须制定src),
    // 所以只有两种情况，frames有时srcID没有值, frames没有值时，srcID有值
    loadFrames(actionType, rowNum = 1, colNum = 1, frames, srcID) {
        //this.MAL.loadFrames
        let loadedFrames;
        // const type = toString.call(frames).slice(8, -1);
        const actions = actionType.split('.');
        if (frames) {
            loadedFrames = this.MAL.loadFrames(frames, rowNum, colNum);
            actions.forEach(action => {
                this.animateState[action] = {};
                this.animateState[action]['base'] = loadedFrames;
            })
        } else {
            loadedFrames = this.MAL.loadFrames(this.cache, rowNum, colNum, srcID);
            actions.forEach(action => {
                this.animateState[action] = {};
                this.animateState[action]['base'] = loadedFrames;
            })
        }
        return this;
    }

    // state制定每个动作所需要的动画帧
    setState(callback) {
        // const frames = this.MAL.getFrames();
        const state = callback.call(this, this);
        const MAL = this.MAL;

        function recurse(obj, dist, actions, mapFunc) {
            for (let key of Object.keys(obj)) {
                let type = toString.call(obj[key]).slice(8, -1);
                if (type === 'Object') {
                    dist[key] = { ...dist[key]};
                    actions[key] = {};
                    recurse(obj[key], dist[key], actions[key], mapFunc);
                } else {
                    actions[key] = noop;
                    dist[key] = mapFunc(obj[key], typeof dist.base !== 'undefined'?dist.base:dist[key].base);
                }
            }
        }
        // 根据state(数据)映射到animateState(帧)和动作函数
        recurse(state, this.animateState, this.actions, (val, base) => {
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
        // console.log(this.animateState);
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
        typeof callback === 'function' ? callback.call(this) : null;
        return this;
    }

    isStop() {
        const rt = this.speedX || this.speedY;
        return !rt;
    }

    stopMove = () => {
        console.log('stop soldier');
        this.setSpeed(0, 0);
    }

    startMove() {
        this.initSpeed();
    }

    // move to
    _moveTo = (dest) => {
        let timer = setInterval(() => {
            const position = this.getPosition();
            if (position.x === dest.x && position.y === dest.y) {
                this.stopMove();
                this.MAL.stop();
                clearInterval(timer);
            }
            this._moveTo(dest)
        }, 100);
    }

    // 路径优化一下
    _judgeShortestDirection(target) {
        const {x,y} = target.getPosition();
        const position = this.getPosition();
        const xLength = Math.abs(position.x - x);
        const yLength = Math.abs(position.y - y);
        let primarity;
        if (xLength < yLength && xLength) {
            primarity = ['LEFT', 'RIGHT'];
        }

        if (yLength < xLength && yLength) {
            primarity = ['UP', 'DOWN'];
        }

        if (yLength === xLength) {
            primarity = ['LEFT', 'RIGHT', 'UP', 'DOWN'];
        }

        if (xLength === 0) {
            primarity = ['UP', 'DOWN'];
        }

        if (yLength === 0) {
            primarity = ['LEFT', 'RIGHT'];
        }
    
        return primarity;
    }

    // 判断目标方向
    // 参数是Soldier对象
    _judgeDirection(target) {
        const rt = [];
        const {x,y} = target.getPosition();
        const position = this.getPosition();
        if (x > position.x) {
            rt.push('RIGHT');
        }

        if (x < position.x) {
            rt.push('LEFT');
        }

        if (y > position.y) {
            rt.push('DOWN');
        }

        if (y < position.y) {
            rt.push('UP');
        }
        return rt;
    }

    // 移动到目标
    // 参数目标坐标
    moveTo = (dest, forbiddenDirection = []) => {
        const totalAction = ['RIGHT', 'LEFT', 'DOWN', 'UP'];
        this.isStop() ? this.startMove() : null;
        this.avaliableDirection = [];
        // 判断方向
        const directions = this._judgeDirection(dest);
        directions.forEach(direction => {
            // this.avaliableDirection.push('MOVE@'+direction);
            this.avaliableDirection.push(direction);
        })
        // 剔除禁止的方向
        forbiddenDirection.forEach((direc) => {
            let index = this.avaliableDirection.findIndex(d => {
                return d === direc
            })
            if (index !== -1) {
                this.avaliableDirection.splice(index, 1);
            }
        });

        // 如果没有路径可走，则随机一个没有禁止的方向
        if (this.avaliableDirection.length <= 0) {
            // 剔除禁止方向
            forbiddenDirection.forEach((direc) => {
                let index = totalAction.findIndex(d => {
                    return d === direc
                })
                if (index !== -1) {
                    totalAction.splice(index, 1);
                }
            });
            // 剩余随机方向
            // 剩余方向没有
            if (totalAction.length > 0) {
                const randomDirection = totalAction[Math.floor(Math.random() * totalAction.length)];
                this.doAction('MOVE@' + randomDirection);
                return;
            }
            this.doAction(this.actionTypes[Math.floor(Math.random() * this.actionTypes.length)]);
            return;
        }
        // 优化路径
        // let best;
        // const prefer = this._judgeShortestDirection(dest);
        // this.avaliableDirection.forEach(direction => {
        //     // 有优化的选择
        //     if (prefer.includes(direction)) {
        //         best = direction;
        //     }
        // })

        // if (best === this.lastStep) {
        //     this.doAction(this.lastStep);
        //     return;
        // }
        // this.doAction('MOVE@'+best);
        // return;
        // 是否是同一方向，这里采取的是如果上一次方向可用，则继续上一次方向，而不是随机方向
        // 导致人物走较长的折线
        const temp = this.lastStep.split('@');
        if (temp[0] === 'MOVE' && this.avaliableDirection.includes(temp[1])) {
            this.doAction(this.lastStep);
            return;
        }
        const action = this.avaliableDirection[Math.floor(Math.random() * this.avaliableDirection.length)];
        //console.log(actions)
        action ? this.doAction('MOVE@'+action) : null;
    }
    // 获取位置
    getPosition() {
        // return {
        //     x: this.sprite.x,
        //     y: this.sprite.y
        // }
        return {
            x: this.displayEntity.x,
            y: this.displayEntity.y
        }
    }

    // 设置位置
    setPosition(x = 0, y = 0) {
        if (typeof x === 'object') {
            this.displayEntity.position.set(x.x, x.y);
        } else {
            this.displayEntity.position.set(x, y);
        }
    }
    // 转向
    // 参数方向或者Soldier对象
    turnTo(to) {
        if (typeof to === 'string') {
            this.direction = to;
        } else {
            const directions = this._judgeDirection(to);
            this.direction = directions[Math.floor(Math.random()*directions.length)];
        }
        // console.log('turn to '+this.direction);
        // this.changeFrame(this.direction, this.texture);
        // this.sprite.texture = this.texture;
        //this.sprite.texture.update();
    }

    // 将该对象加入容器中
    addToScene(scene) {
        console.log(this.SoldierType + '加入战场');
        scene.addChild ? scene.addChild(this.displayEntity) : console.error('加入的不是容器，请检查其类型');
    }
}

export default Solider
