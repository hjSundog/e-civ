
// 该对象设计主要用于检测浏览器窗口变化和管理游戏界面的尺寸比例
// 仲裁各个对象的行为和状态，类似于一个管理器
export default class BattleGround{
    constructor(x = 800, y = 600, layout = {height: 30, width: 40}) {
        this.x = x;
        this.y = y;
        this.layout = layout;
        this.children = [];
        this.groups = {};
    }

    resize(x, y) {
        this.x = x;
        this.y = y;
    }

    makeChildrenActive(children) {
        // 便利每个孩子决定其行为
    }

    addToGroup(children, groupName) {
        return this.groups[groupName]?this.groups[groupName] = [...this.groups[groupName], ...children]:this.groups[groupName] = [...children];
    }

    // 加入对象
    addChild(child){
        this.children.push(child);
    }

    // 判断是否移动
    judgeMove(child) {

    }

    // 判断是否能够攻击
    judgeAttack(child) {

    }

    // 判断对象状态
    judgeLiveState(child) {

    }

    // 指挥对象释放技能
    judgeSkill(child) {

    }

    computeLatestEnemy(child) {

    }
}

