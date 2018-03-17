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
        this.animateState = {};

        this.nowActionState = '';
        // 动作怔状态
        this.loopState = 0;
        this.maxLoopState = 4;
    }

    setAnimateState() {

    }

    // 针对每种行为制作其动画,子动画使用@链接,MOVE@UP
    doAction(actionType) {
        this.MAL.stop();
        const actions = actionType.split('@');
        const frames = actions.reduce((pre, next) => {
            return pre[next];
        }, this.animateState);
        const type = toString.call(frames).slice(8, -1);
        type === 'Array'
        ?this.MAL.animate(frames)
        :this.MAL.changeFrame(frames);
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
        function recurse(obj, dist, mapFunc) {
            for (let key of Object.keys(obj)) {
                let type = toString.call(obj[key]).slice(8, -1);
                if (type === 'Object') {
                    dist[key] = {...dist[key]};
                    recurse(obj[key], dist[key], mapFunc);
                } else {
                    dist[key] = mapFunc(obj[key], dist.base);
                }
            }
        }
        recurse(state, this.animateState, (val, base)=>{
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
        // 初始化INIT
        this.sprite.texture = this.animateState['INIT'];
        //console.log(this.animateState);
    }

    // 指定初始化帧，指定精灵位置，指定精灵交互情况,如果你有特定的初始帧可以在回调函数中
    // 指定，否则输入帧序数，该初始化会在loadFrames之后进行
    init(x, y, interactiveable, callback) {
        // 动画管理对象
        this.MAL = new MakeAnimationLoop(this.sprite);
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

    // changeFrame(direction, texture){
    //     const {height, width} = texture.frame
    //     texture.frame = this.createRectangle(direction, width, height);
    //     texture._updateUvs();
    // }

    // createRectangle(direction, width, height) {
    //     let rectangle;
    //     switch (direction) {
    //         case 'R':
    //             rectangle = new Rectangle(this.frame.frame.x + width * this.loopState, this.frame.frame.y + height * 2, width, height)
    //             break;
    //         case 'L':
    //             rectangle = new Rectangle(this.frame.frame.x + width * this.loopState, this.frame.frame.y + height, width, height)
    //             break;
    //         case 'D':
    //             rectangle = new Rectangle(this.frame.frame.x + width * this.loopState, 0, width, height)
    //             break;
    //         case 'U':
    //             rectangle = new Rectangle(this.frame.frame.x + width * this.loopState, this.frame.frame.y + height * 3, width, height)
    //             break;
    //         default:
    //             rectangle = new PIXI.Rectangle(0, 0, width, height)
    //     }

    //     return rectangle;
    // }

    // judgeFrame(direction, texture) {
    //     const distTexture = _.cloneDeep(texture);
    //     const width = distTexture.orig.width;
    //     const height = distTexture.orig.height;
    //     const wPiece = width / 4;
    //     const hPiece = height / 4;
    //     distTexture.frame = this.createRectangle(direction, wPiece, hPiece);
    //     distTexture._updateUvs();
    //     return distTexture;
    // }
}

export default Solider