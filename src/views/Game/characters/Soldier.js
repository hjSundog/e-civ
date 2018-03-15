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

    constructor(cache) {
        this.ROOT_PATH = 'static/images/';
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
        this.sprite = null;
        this.cache = cache;
        // 方向
        this.direction = 'R';
        // 状态设置
        // 动作状态
        this.animateState = ['MOVE', 'SKILL', 'DIE', 'ATTACK'];
        this.nowActionState = 'MOVE';
        // 动作怔状态
        this.loopState = 0;
        this.maxLoopState = 4;
    }

    setAnimateState() {

    }

    // 针对每种行为制作其动画
    makeActionAnimation(action, frameSource, special, texture) {
        
    }

    // 保存所有动作的贴图状态
    initActionState() {
        this.state = {
            move: [],
            attack: [],
            skill: [],
            die: []
        }
    }

    animate(state) {
        switch(state) {
            case 'MOVE':
                break;
            case 'SKILL':
                break;
            case 'DIE':
                break;
            case 'ATTACK':
                break;
            default:
                return;
        }
    }

    changeSprite() {

    }

    init() {
        this.fullTexture = _.cloneDeep(this.cache.textures[this.SoldierType+'.png']);
        this.frame = _.cloneDeep(this.cache.data.frames[this.SoldierType+'.png']);
        this.texture = this.judgeFrame(this.direction,  _.cloneDeep(this.fullTexture));
        this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.x = Math.floor(Math.random() * 800);
        this.sprite.y = Math.floor(Math.random() * 600);
        // 相应事件
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        const that = this;
        this.sprite.on('pointerdown', () => {
            switch (that.direction) {
                case 'U':
                    that.turnTo('R');
                    break;
                case 'R':
                    that.turnTo('D');
                    break;
                case 'D':
                    that.turnTo('L');
                    break;
                case 'L':
                    that.turnTo('U');
                    break;
                default:
                    return;
            }
        });
    }
    // 设置位置
    setPosition(x, y) {
        if (typeof x === 'object') {

        } else {

        }
    }
    // 转向
    turnTo(direction) {
        console.log('ture to: ' + direction);
        this.direction = direction;
        this.changeFrame(this.direction, this.texture);
        this.sprite.texture = this.texture;
        //this.sprite.texture.update();
    }

    // 将该对象加入容器中
    addToScene(scene) {
        console.log(this.SoldierType + '加入战场');
        scene.addChild ? scene.addChild(this.sprite) : console.error('加入的不是容器，请检查其类型');
    }

    changeFrame(direction, texture){
        const {height, width} = texture.frame
        texture.frame = this.createRectangle(direction, width, height);
        texture._updateUvs();
    }

    createRectangle(direction, width, height) {
        let rectangle;
        switch (direction) {
            case 'R':
                rectangle = new Rectangle(this.frame.frame.x + width * this.loopState, this.frame.frame.y + height * 2, width, height)
                break;
            case 'L':
                rectangle = new Rectangle(this.frame.frame.x + width * this.loopState, this.frame.frame.y + height, width, height)
                break;
            case 'D':
                rectangle = new Rectangle(this.frame.frame.x + width * this.loopState, 0, width, height)
                break;
            case 'U':
                rectangle = new Rectangle(this.frame.frame.x + width * this.loopState, this.frame.frame.y + height * 3, width, height)
                break;
            default:
                rectangle = new PIXI.Rectangle(0, 0, width, height)
        }

        return rectangle;
    }

    judgeFrame(direction, texture) {
        const width = texture.orig.width;
        const height = texture.orig.height;
        const wPiece = width / 4;
        const hPiece = height / 4;
        texture.frame = this.createRectangle(direction, wPiece, hPiece);
        texture._updateUvs();
        return texture;
    }
}

export default Solider