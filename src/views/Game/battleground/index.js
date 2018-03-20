
// 该对象设计主要用于检测浏览器窗口变化和管理游戏界面的尺寸比例
// 仲裁各个对象的行为和状态，类似于一个管理器

// 判断画布边界
//Contain the sprite and find the collision value
// let collision = contain(anySprite, {x: 0, y: 0, width: 512, height: 512});

// //If there's a collision, display the boundary that the collision happened on
// if(collision) {
//   if collision.has("left") console.log("The sprite hit the left");  
//   if collision.has("top") console.log("The sprite hit the top");  
//   if collision.has("right") console.log("The sprite hit the right");  
//   if collision.has("bottom") console.log("The sprite hit the bottom");  
// }

// 碰撞检测
// let playerVsPlatforms = hit(
//     player,                  // sprite one
//     world.platforms,         // sprite two
//     true,                    // prevent overlap
//     false,                   // bounce
//     false,                   // global coordinate
//     function(collision, platform){
  
//       //`collision` tells you the side on player that the collision occurred on.
//       //`platform` is the sprite from the `world.platforms` array
//       //that the player is colliding with
//     }
//   );

import _ from 'lodash';
import * as PIXI from 'pixi.js';
import DC from '../utils/DetectCollision';
import Bump from 'bump.js'
export default class BattleGround {
    constructor(x = 800, y = 600, layout = { col: 30, row: 40 }, scene = new PIXI.Container()) {
        this.layout = layout;
        this.children = [];
        this.scene = scene;
        this.groups = {};
        // 缩放比例
        this.scale = {
            x: 1,
            y: 1
        };
        this.bump = new Bump(PIXI);
        // 每格单位所占长宽
        this.resize(x, y);
    }
    
    getCenter(){
        return {
            x: this.x/2,
            y: this.y/2
        }
    }

    getBoxSize(){
        return {
            width: this.xs,
            height: this.ys
        }
    }

    getScene() {
        return this.scene;
    }

    // 战场开始
    initGroup(dist) {
        // 初始化人物位置
        // this._initChildren(dist);
        // 人物战斗循环及其移动、攻击、技能判定
        for (let group of Object.keys(this.groups)) {
            this._initGroupPosition(group, group===dist);
        }
        return this;
    }

    // 初始化一组位置
    _initGroupPosition = (group, isLeft) => {
        const children = this.groups[group];
        // 默认
        let direction = 1;
        // 记录一次的位置
        let prePosition = 0;
        // 设置大体位置
        if (!!!isLeft) {
            direction = -1;
            prePosition = this.layout.row * (this.layout.col-1);
        }
        // 按照优先级排序之后进行初始化位置
        const groupChildren = _.groupBy(children, (child) => {
            return child.primarity;
        });
        const orderedChildren = _.sortBy(groupChildren, ['primarity']);
        // console.log(orderedChildren);
        //　判断每种兵种所占位置
        orderedChildren.forEach(child => {
            prePosition = this._judgeArea(child, direction, prePosition);
        })
    }

    // 判断所占区域
    // 参数说明: 需要放置的原素，方向， 上次结束放置位置
    _judgeArea(children, direction, last) {
        const length = children.length;
        //适配横版或者竖版这里默认为横版
        const isLandScope = true;
        let boardMap = isLandScope?(val)=>{
            // 默认为横版
            const {row, col} = this.layout;
            const rt = [(val%row+row-1)%row, Math.floor((val-1)/row)];
            return rt;
        }:(val) => {
            const {row, col} = this.layout;
            return [Math.floor((val-1)/col), (val%col-1+col)%col];
        }
        // 列数
        if (direction < 0) {
            // 从右到左放置
            let temp = 1;
            for (let i=0;i<length;i++) {
                // 如果当前可以被row整除,则下一次减一
                last ++;
                // console.log(last);
                const matrix = boardMap(last);
                // console.log(matrix);
                this._justifyBox(matrix[0], matrix[1], children[i]);
                if (last%this.layout.row === 0) {
                    temp = -1;
                }
                if (temp === -1) {
                    last -= 2*this.layout.row;
                    temp = 1;
                }
            }
        } else {
            // 从左到右放置
            for (let i=0;i<length;i++) {
                last++;
                // console.log(last);
                const matrix = boardMap(last);
                // console.log(matrix);
                this._justifyBox(matrix[0], matrix[1], children[i]);
            }

        }
        return last;
    }

    // 将组对象加入场景。fittable是否保持缩放
    addGroupToScene = (fittable) => {
        let totalChildren = [];
        for (let group of Object.keys(this.groups)) {
            totalChildren = [...totalChildren, ...this.groups[group]];
        }
        totalChildren.forEach(child=>{
            this.addChildToScene(child, fittable);
        })
        return this;
    }

    battle = () => {
        //this.makeChildrenActive();
        this.children.forEach(child=>{
            // this.moveRandom(child);
            // 每个人物激活
            child.active();
            // child.moveTo(this.getCenter());
        });
        console.log('battle start');
    }

    // 将所有子对象加载到场景中
    addChildToScene(child, fittable) {
        if (fittable) {
            const {sprite} = child;
            const {height, width} = sprite;
            const {ys, xs} = this;
            sprite.scale.x = xs/width;
            sprite.scale.y = ys/height;
            //sprite.anchor.set(0.5, 0.5);
        }
        const {width, height} = this.getBoxSize();
        child.unitX = width;
        child.unitY = height;
        child.addToScene(this.scene);
    }

    // 自适应格子
    _justifyBox(row, col, element) {
        const y = row * this.ys;
        const x = col * this.xs;
        element.setPosition(x, y);
        // test
        //element.addToScene(this.scene);
    }

    resize(x, y) {
        this.x = x;
        this.y = y;
        this.xs = x / this.layout.col;
        this.ys = y / this.layout.row;
    }

    // test
    moveRandom = (target) => {
        const actionType = ['UP','DOWN','LEFT','RIGHT'];
        const prefix = 'MOVE';
        // target.doAction('MOVE@UP');
        setInterval(()=>{
            const bounds = this._boundLimit(target.sprite);
            const avaliableDirection = actionType.filter(action => {
                return !bounds.includes(action)
            })
            // console.log(avaliableDirection);
            target.doAction(`${prefix}@${avaliableDirection[Math.floor(Math.random()*avaliableDirection.length)]}`);
        }, 2000);
    }

    // TODO: bump contain替换
    // 返回当前精灵的所处边界
    _boundLimit(sprite) {
        const  {x, y} = sprite;
        const bounds = [];
        if (x < 0) {
            bounds.push('LEFT');
        }
        if (y < 0) {
            bounds.push('UP');
        }
        if (x > this.x) {
            bounds.push('RIGHT');
        }
        if (y > this.y) {
            bounds.push('DOWN');
        }
        return bounds;
    }

    moveToOtherSide = () => {

    }
    // TODO:
    makeChildrenActive(child, actionName) {
        let otherSide;
        // 该对象没有目标则随机分配一个目标
        if (!child.enemy) {
            const side = child.groupName;
            for (let name of Object.keys(this.groups)) {
                if (name !== side) {
                    otherSide = this.groups[name]
                }
            }
            // 随机一个目标对象
            const randEnemy = otherSide[Math.floor(Math.random()*otherSide.length)];
            child.enemy = randEnemy;
        }
        // 便利每个孩子决定其行为
        if (!this.judgeLiveState(child)) {
            child.die();
            return;
        } 
        // 判断是否可以攻击
        if (this.judgeAttack(child, child.enemy)) {
            // console.log('你已经在我攻击范围了： '+child.enemy.SoldierType);
            // 是否使用技能
            if (this.judgeSkill(child, child.enemy)) {
                console.log('使用技能了');
            } else {
                // 平A
                if (!child.isStop()) {
                    child.stopMove();
                }
                child.attack(child.enemy);
            }
            return;
        }
        // 判断是否可以移动，并且决定移动方向
        if (this.judgeMove(child, child.enemy)) {
            // 
        }
    }

    addToGroup = (children, groupName) => {
        
        // 将每个对象的战场对象注册为本对象
        children.forEach(child=>{
            child.BattleGround = this;
            child.groupName = groupName;
        })
        // 加入this.children数组
        children.reduce((target, child) => {
            target.push(child);
            return target;
        }, this.children);
        // 加入group
        return this.groups[groupName] ? this.groups[groupName] = [...this.groups[groupName], ...children] : this.groups[groupName] = [...children];
    }

    // 加入对象
    addChild(child) {
        child.BattleGround = this;
        this.children.push(child);
    }

    // 移除对象
    removeChild(child) {
        const index = this.children.findIndex(ele=>{
            return ele === child;
        });
        if (index === -1) {
            return console.error('没有该对象，不能移除!');
        }
        this.children.splice(index, 1);
        // 移出group
        const groups = this.groups[child.groupName];
        if (groups) {
            const _index = groups.findIndex(ele=>{
                return ele === child;
            });
            if (_index === -1) {
                return console.error(child.groupName+' 中没有改对象,请检查!');
            }
            groups.splice(_index, 1);
        }
    }

    // 判断是否移动
    judgeMove(child, enemy) {
        // 判断移动范围
        const point = enemy.getPosition();
        const {x, y} = child.getPosition();
        // 先不考虑碰撞检测
        child._moveTo(point);
    }

    // 判断是否能够攻击
    judgeAttack(child, enemy) {
        const point = enemy.getPosition();
        const {x, y} = point;
        const {minX, minY, maxX, maxY} = this._getAttackArea(child);
        // 判断敌人是否在攻击范围内
        if (x < maxX && x > minX && y < maxY && y > minY) {
            return true;
        }
        return false;
    }

    // 周围九宫格
    _getAttackArea = (target) => {
        const local = target.getPosition();
        // 单元格数目
        const {attackArea} = target;
        // 单元格长宽
        const {width, height} = this.getBoxSize();
        const {x, y} = local;
        return {
            minX: x - attackArea*width,
            maxX: x + 2*width*attackArea,
            minY: y - height*attackArea,
            maxY: y + 2*height*attackArea
        }
        
    }

    // 判断对象状态
    judgeLiveState(child) {
        return child.getLiveState();
    }

    // 指挥对象释放技能
    judgeSkill(child) {
        return false;
    }

}

