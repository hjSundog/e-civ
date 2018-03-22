
// 该对象设计主要用于检测浏览器窗口变化和管理游戏界面的尺寸比例
// 仲裁各个对象的行为和状态，类似于一个管理器
import _ from 'lodash';
import * as PIXI from 'pixi.js';
import Bump from 'bump.js'
export default class BattleGround {
    constructor(x = 800, y = 600, layout = { col: 30, row: 40 }, gameScene = new PIXI.Container(), gameOverScene = new PIXI.Container()) {
        this.gameOverScene = gameOverScene;
        this.gameScene = gameScene;
        this.layout = layout;
        this.children = [];
        this.groups = {};
        // 缩放比例
        this.scale = {
            x: 1,
            y: 1
        };
        this.bump = new Bump(PIXI);
        // 每格单位所占长宽
        this.resize(x, y);
        // 是否胜利
        this.isBattleOver = false;
    }

    getCenter() {
        return {
            x: this.x / 2,
            y: this.y / 2
        }
    }

    getBoxSize() {
        return {
            width: this.xs,
            height: this.ys
        }
    }

    getScene() {
        return this.gameScene;
    }

    // 战场开始
    initGroup(dist) {
        // 初始化人物位置
        // this._initChildren(dist);
        // 人物战斗循环及其移动、攻击、技能判定
        for (let group of Object.keys(this.groups)) {
            this._initGroupPosition(group, group === dist);
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
        if (!isLeft) {
            direction = -1;
            prePosition = this.layout.row * (this.layout.col - 1);
        }
        // 按照优先级排序之后进行初始化位置
        const groupChildren = _.groupBy(children, (child) => {
            return child.primarity;
        });
        const orderedChildren = _.sortBy(groupChildren, ['primarity']);
        // console.log(orderedChildren);
        // 判断每种兵种所占位置
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
        let boardMap = isLandScope ? (val) => {
            // 默认为横版
            const { row, col } = this.layout;
            const rt = [(val % row + row - 1) % row, Math.floor((val - 1) / row)];
            return rt;
        } : (val) => {
            const { row, col } = this.layout;
            return [Math.floor((val - 1) / col), (val % col - 1 + col) % col];
        }
        // 列数
        if (direction < 0) {
            // 从右到左放置
            let temp = 1;
            for (let i = 0; i < length; i++) {
                // 如果当前可以被row整除,则下一次减一
                last++;
                // console.log(last);
                const matrix = boardMap(last);
                // console.log(matrix);
                this._justifyBox(matrix[0], matrix[1], children[i]);
                if (last % this.layout.row === 0) {
                    temp = -1;
                }
                if (temp === -1) {
                    last -= 2 * this.layout.row;
                    temp = 1;
                }
            }
        } else {
            // 从左到右放置
            for (let i = 0; i < length; i++) {
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
        totalChildren.forEach(child => {
            this.addChildToScene(child, fittable);
        })
        return this;
    }

    battle = () => {
        //this.makeChildrenActive();
        this.children.forEach(child => {
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
            const { sprite } = child;
            const { height, width } = sprite;
            const { ys, xs } = this;
            sprite.scale.x = xs / width;
            sprite.scale.y = ys / height;
            //sprite.anchor.set(0.5, 0.5);
        }
        const { width, height } = this.getBoxSize();
        child.unitX = width;
        child.unitY = height;
        child.addToScene(this.gameScene);
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
        const actionType = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
        const prefix = 'MOVE';
        // target.doAction('MOVE@UP');
        setInterval(() => {
            const bounds = this._boundLimit(target.sprite);
            const avaliableDirection = actionType.filter(action => {
                return !bounds.includes(action)
            })
            // console.log(avaliableDirection);
            target.doAction(`${prefix}@${avaliableDirection[Math.floor(Math.random() * avaliableDirection.length)]}`);
        }, 2000);
    }

    // 清理战场
    clearBattleGround = (side) => {
        if (this.isBattleOver) {
            console.log('清理战场中...');
            // 停止所有动作
            this.children.forEach(child=>{
                child.stop();
            })
            typeof this.overCB === 'function'?this.overCB(side):null;
            this.gameScene.visible = false;
            this.gameOverScene.visible = true;
            console.log('战场打扫完毕！');
        }
    }

    // 接受回调
    over = (cb) => {
        this.overCB = cb;
    }

    moveToOtherSide = () => {

    }
    // TODO: 判断战斗是否结束-> 判断该对象是否存活 -> 判断该对象是否可以攻击-> 移动到
    // 可攻击范围->
    makeChildrenActive(child) {
        let otherSide;
        // 没有地方战斗结束
        const side = child.groupName;   // 本方阵营
        for (let name of Object.keys(this.groups)) {
            if (name !== side) {
                otherSide = this.groups[name]
            }
        }
        // 敌方全灭
        if (otherSide.length === 0) {
            //console.log(side+'方赢了这场战斗!');
            this.isBattleOver = true;
            child.stop();
            this.clearBattleGround(side);
            return;
        }
        // 便利每个孩子决定其行为
        if (!this.judgeLiveState(child)) {
            child.die();
            return;
        }
        // 该对象没有目标则随机分配一个目标
        if (!child.enemy) {
            // 随机一个目标对象
            const randEnemy = otherSide[Math.floor(Math.random() * otherSide.length)];
            child.enemy = randEnemy;
            // 该目标对象保存攻击者，以便于自己死亡时通知攻击者更改目标对象
            randEnemy.attackedBy.push(child);
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
                //  console.log(child.SoldierType+' has '+ child.blood +'HP will attack the ' + child.enemy.blood + 'HP ' + child.enemy.SoldierType)
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
        children.forEach(child => {
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
        const index = this.children.findIndex(ele => {
            return ele === child;
        });
        if (index === -1) {
            return console.error('没有该对象，不能移除!');
        }
        this.children.splice(index, 1);
        // 移出group
        const groups = this.groups[child.groupName];
        if (groups) {
            const _index = groups.findIndex(ele => {
                return ele === child;
            });
            if (_index === -1) {
                return console.error(child.groupName + ' 中没有改对象,请检查!');
            }
            groups.splice(_index, 1);
        }

        return this;
    }

    // 获取当前对象之外的其他对象
    _getExtraChildren = (child) => {
        const children = [...this.children];
        const index = children.findIndex(ele => {
            return ele === child;
        });
        if (index === -1) {
            return console.error('没有找到该对象，请检查参数!');
        }
        children.splice(index, 1);
        return children;
    }

    

    // 判断是否移动
    judgeMove(child, enemy) {
        // 判断移动范围
        const point = enemy.getPosition();
        const {x, y} = this;
        const forbiddenDirection = new Set();
        // const { x, y } = child.getPosition();
        // 边界检测
        let boundLimit = this.bump.contain(child.getSprite(), { x: 0, y: 0, width: x, height: y });

        //If there's a collision, display the boundary that the collision happened on
        if (boundLimit) {
            if (boundLimit.has("left")){
                // console.log("The sprite hit the left");
                forbiddenDirection.add('MOVE@LEFT');
            } 
            if (boundLimit.has("top")){
                //console.log("The sprite hit the top");
                forbiddenDirection.add('MOVE@UP');

            } 
            if (boundLimit.has("right")){
                //console.log("The sprite hit the right");
                forbiddenDirection.add('MOVE@RIGHT');
            } 
            if (boundLimit.has("bottom")){
                //console.log("The sprite hit the bottom");
                forbiddenDirection.add('MOVE@DOWN');
            } 
        }
        // 碰撞检测
        const otherChildren = this._getExtraChildren(child);
        const sprites = otherChildren.map(oChild => {
            return oChild.getSprite();
        })
        const collision = this.bump.hit(child.getSprite(), 
            sprites,
            false,
            false,
            true,
            // (colli, platform) => {
            //     console.log('get Collision')
            //     return;
            // }
        )
        // 存在碰撞
        if (collision) {
            // 转向
            switch(collision) {
            case 'right':
                forbiddenDirection.add('MOVE@RIGHT');
                break;
            case 'left':
                forbiddenDirection.add('MOVE@LEFT');
                break;
            case 'top':
                forbiddenDirection.add('MOVE@UP');
                break;
            case 'down':
                forbiddenDirection.add('MOVE@DOWN');
                break;
            default:
                console.log('collistion has '+collision);   
            }
        }
        const TFD = Array.from(forbiddenDirection);
        if (TFD.length) {
            console.log('不能向'+TFD+'走了');
        }
        child.moveTo(point, TFD);
    }

    // 判断是否能够攻击
    judgeAttack = (child, enemy) => {
        const point = enemy.getPosition();
        const { x, y } = point;
        const { width, height } = this.getBoxSize();
        const attackArea = this._getAttackArea(child);
        const enemyR = {
            x: x,
            y: y,
            width: width,
            height: height
        }
        // 判断敌人是否在攻击范围内
        const canAttack = attackArea.some(area => {
            return this.bump.hitTestRectangle(area, enemyR)
        });
        return canAttack;
    }


    // 判断两个区域是否相交


    // 周围九宫格或者四个方向
    // 返回Rectangle对象数组
    _getAttackArea = (target) => {
        const local = target.getPosition();
        // 单元格数目
        const { attackArea } = target;
        // 单元格长宽
        const { width, height } = this.getBoxSize();
        const { x, y } = local;
        const rectangles = [];
        // 中间矩形
        const cr = {
            x: x,
            y: y,
            width: width,
            height: height
        }
        rectangles.push(cr);
        // 上面矩形
        for(let i=0;i<attackArea;i++) {
            // 左右
            let rr = {
                x: x + width*i,
                y: y,
                width: width,
                height: height
            };
            let lr = {
                x: x - width*i,
                y: y,
                width: width,
                height: height
            };
            // 上下
            let ur = {
                x: x,
                y: y + i*height,
                width: width,
                height: height
            }
            let dr = {
                x: x,
                y: y - i*height,
                width: width,
                height: height
            }
            rectangles.concat(rr, lr, ur, dr);
        }


        return rectangles

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

