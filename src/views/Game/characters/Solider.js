// 物理攻击时无视目标的部分护甲，来自其他单位的物理伤害不会享受来自你的物理穿透效果。
// 护甲穿透分为比例穿透和定值穿透：
// 1.比例穿透：你的物理攻击在计算伤害时默认降低被攻击者一定百分比护甲；
// 2.定值穿透：你的物理攻击在计算伤害时默认降低被攻击者一定值的护甲，在其护甲低于你的护甲穿透时护甲减免伤害为0。
// 当你同时拥有固定和比例两种穿透时，先计算比例穿透，再计算固定穿透。
// 例：目标护甲为100，你有50%的比例护甲穿透和60定值穿透，当你攻击该目标时，目标护甲值先减少50%,剩余50，再受到60点护甲穿透，为0，你对他造成的伤害不会减少。
// 护甲的减少伤害公式：100/（100+护甲值）
import * as PIXI from 'pixi.js';
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
        this.allSprite = cache;
        // 贴图
        this.direction = 'R';
        this.directionState = 0;
    }

    init() {
        this.judgeFrame(this.direction, this.texture);
        this.sprite = new PIXI.Sprite(this.texture);
    }

    setPosition(x, y) {
        if (typeof x ===  'object') {

        } else {
            
        }
    }

    // 将该对象加入容器中
    addToScene(scene) {
        console.log(this.SoldierType + '加入战场');
        scene.addChild?scene.addChild(this.sprite):console.error('加入的不是容器，请检查其类型');
    }


    judgeFrame(direction, texture) {
        let rectangle;
        const width = texture.orig.width;
        const height = texture.orig.height;
        const wPiece = width/4;
        const hPiece = height/4;
        switch(direction) {
            case 'R':
                rectangle = new Rectangle(wPiece*this.directionState, hPiece*2, wPiece, hPiece)
                break;
            case 'L':
                rectangle = new Rectangle(wPiece*this.directionState, hPiece, wPiece, hPiece)
                break;
            case 'U':
                rectangle = new Rectangle(wPiece*this.directionState, 0, wPiece, hPiece)
                break;
            case 'D':
                rectangle = new Rectangle(wPiece*this.directionState, hPiece*3, wPiece, hPiece)
                break;
            default:
                rectangle = new PIXI.Rectangle(0, 0, wPiece, hPiece)
        }
        texture.frame = rectangle;
        return texture;
    }
}

export default Solider