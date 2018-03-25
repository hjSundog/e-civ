// 本类用于管理飞行或者说间接伤害武器
import * as PIXI from 'pixi.js';
import _ from 'lodash';
import noop from '@/utils/noop.js';

class ShotItem {
    constructor(enemy, texture) {
        // console.log(enemy);
        this.enemy = enemy;
        this._init(texture);
        this.speed = 20;
    }


    init = (frame, x, y) => {
        this.setTexture(frame);
        this._setPosition(x, y);
        this.sprite.visible = true;

    }

    // 将该对象加入容器中
    addToScene(scene) {
        scene.addChild ? scene.addChild(this.sprite) : console.error('加入的不是容器，请检查其类型');
    }

    // 设置图案
    setTexture(texture) {
        // 可以做一些判定是否是texture对象
        const type = toString.call(texture).slice(8, -1);
        if (type === 'Array') {
            this.sprite.texture = texture[0];
        } else if (type === 'Object') {
            this.sprite.texture = texture;
        } else {
            console.log('传入shotItem的参数有误，请检查!');
        }
    }


    setSpeed(speed) {
        this.speed = speed;
    }

    _init(texture) {
        this.sprite = new PIXI.Sprite();
        texture?this.sprite.texture = texture:null;
    }

    // 飞行函数，回调用于击中目标之后运行
    fly = (callback) => {
        this._cb = callback;
        this.timer = setInterval(this._fly, 10);
    }


    // 击中敌人停止飞行
    // 敌人死亡停止飞行
    stopFly(){
        // 清除该对象及其引用
        // code here
        this.sprite.visible = false;
        // 清除定时器
        clearInterval(this.timer);
    }

    // 定时器运行函数
    _fly = () => {
        const itemRec = this.getArea();
        const enemyRec = this.enemy.getArea();
        if (this._isHitTarget(itemRec, enemyRec)) {
            this._cb(this.enemy);
            this.stopFly();
            return;
        }
        const myPoint = this._getPosition();
        const tarPoint = {
            x: enemyRec.centerX,
            y: enemyRec.centerY
        };
        // x方向速度
        const vx = (tarPoint.x - myPoint.x) / this.speed;
        const vy = (tarPoint.y - myPoint.y) / this.speed;
        const rotation = this._getRotation(vx, vy);
        // 旋转角度
        this.sprite.rotation = rotation;
        // 位置
        this._setPosition(myPoint.x + vx, myPoint.y + vy);
    }

    // 获取旋转角度
    _getRotation = (width, height) =>{
        return width?Math.atan(height/width):0;
    }

    // 判断是否是击中
    _isHitTarget(r1, r2) {
        let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
        hit = false;
        r1.centerX = r1.x + r1.width / 2;
        r1.centerY = r1.y + r1.height / 2;
        r2.centerX = r2.x + r2.width / 2;
        r2.centerY = r2.y + r2.height / 2;
        r1.halfWidth = r1.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfWidth = r2.width / 2;
        r2.halfHeight = r2.height / 2;
        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;
        combinedHalfWidths = r1.halfWidth + r2.halfWidth;
        combinedHalfHeights = r1.halfHeight + r2.halfHeight;
        if (Math.abs(vx) < combinedHalfWidths) {
            if (Math.abs(vy) < combinedHalfHeights) {
                hit = true;
            } else {
                hit = false;
            }
        } else {
            hit = false;
        }
        return hit;
    }

    // 获取飞行物的范围
    getArea(){
        const {x, y} = this.sprite.position;
        return {
            x: x,
            y: y,
            width: this.sprite.width,
            height: this.sprite.height
        }
    }

    _setPosition(x = 0, y = 0) {
        if (typeof x === 'object') {
            this.sprite.position.set(x.x, x.y);
        } else {
            this.sprite.position.set(x, y);
        }
    }

    _getPosition() {
        const {x, y} = this.sprite;
        return {x, y};
    }

    _getTargetPosition() {
        const {x, y} = this.enemy.getPosition();
        return {x, y};
    }
}

export default ShotItem