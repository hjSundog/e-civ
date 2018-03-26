import React from 'react'
import PropTypes from 'prop-types'
import BattleGround from './battleground'
import Soldiers from './characters'
import _ from 'lodash';
import * as PIXI from 'pixi.js'
import './index.less'
import noop from '@/utils/noop'
// import MakeAnimationLoop from './utils/MakeAnimationLoop'

// 想法，传入的参数应该是两个军队，每个军队数据对象包含兵种及每个兵种的数目，当然每个兵种都有最大值
// 先100个为一组，

let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    // Sprite = PIXI.Sprite,
    // Texture = PIXI.Texture,
    // Rectangle = PIXI.Rectangle,
    Container = PIXI.Container,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle;
    // TextureCache = PIXI.utils.TextureCache;
    // base = new PIXI.BaseTexture(anyImageObject),
    // texture = new PIXI.Texture(base),
    // sprite = new PIXI.Sprite(texture)

//  const ROOT_PATH = 'static/images/'

class Game extends React.Component {
    constructor () {
        super()
        this.state = {
            isPlay: true,
            count: 1
        }
    }

    initGame = () => {
        // 初始化程序
        this.app = new Application({
            width: 800,
            height: 600,
            antialias: true,    // default: false
            transparent: false, // default: false
            resolution: 1       // default: 1
        })
        this.app.renderer.backgroundColor = 0x061639;
        this.wrapper.appendChild(this.app.view);
        this.gameScene = new Container();
        this.gameOverScene = new Container();
        this.gameScene.visible = true;
        this.gameOverScene.visible = false;
        this.battleGround = new BattleGround(800, 600, {row: 5, col: 20}, this.gameScene, this.gameOverScene);
        // 初始化资源
        this.initResource();
    }

    initResource = () => {
        this.enemyList = this.props.enemy;
        this.myList = this.props.my;

        this.definedLoad([
            'static/images/cat.png',
            'static/images/treasureHunter.json',
            'static/images/testCharacter.json'
        ], this.onProgress, () => {
            //console.log(TextureCache);
            console.log(resources);
            const textures = resources['static/images/testCharacter.json'];

            //创建对象
            for (let enemy of this.enemyList) {
                let enemys = this.createManageableSprite(enemy, textures);
                if (enemys.length) {
                    this.battleGround.addToGroup(enemys, 'enemy');
                } else {
                    return;
                }
            }

            for (let me of this.myList) {
                let mes = this.createManageableSprite(me, textures);
                if (mes.length) {
                    this.battleGround.addToGroup(mes, 'my');
                } else {
                    return;
                }
            }

            let style = new TextStyle({
                fontFamily: "Arial",
                fontSize: 36,
                fill: "white",
                stroke: '#ff3300',
                strokeThickness: 4,
                dropShadow: true,
                dropShadowColor: "#000000",
                dropShadowBlur: 4,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 6,
            });
            this.message = new Text('', style);
            const center = this.battleGround.getCenter();
            this.message.anchor.set(0.5, 0.5);
            this.message.position.set(center.x, center.y);
            //this.message.pivot.set(this.message.width/2, this.message.height/2);
            this.gameOverScene.addChild(this.message);
            // battleGround setting
            this.battleGround.initGroup('my');
            this.battleGround.addGroupToScene(true);
            this.battleGround.battle();
            this.battleGround.over((side)=>{
                if (side === 'my') {
                    this.message.text = '恭喜你，己方队伍获得胜利!'
                    return;
                }
                this.message.text = '很遗憾，己方队伍溃败了！';
            })
        })

    }


    bindEvent = () => {

    }

    gameloop = () => {

    }

    end = () => {
        this.gameScene.visible = false;
        this.gameOverScene.visible = true;
    }

    // 创建可管理精灵对象
    createManageableSprite = ({soldierType, count}, cache) => {
        let rt = [];
        if (Soldiers[soldierType]) {
            let num = Math.ceil(count / 100);
            for (let i=0;i<num;i++) {

                let solider = new Soldiers[soldierType](cache, count>=100?100:count);
                count -= 100;

                // 加入数组
                rt.push(solider);
            }
            return rt;
        } else {
            console.error('没有该类士兵，请检查传入的士兵类型是否合法！');
            return [];
        }
    }

    onProgress = (loader, resource) => {

        console.log("loading: " + resource.url);

        //Display the percentage of files currently loaded
        console.log("progress: " + loader.progress + "%");
        //If you gave your files names as the first argument
        //of the `add` method, you can access them like this
        //console.log("loading: " + resource.name);
    }

    definedLoad = (resources, progressHanlder, callback) => {
        if (!callback) {
            callback = progressHanlder
            progressHanlder = noop;
        }

        loader.add(resources)
            .on('progress', progressHanlder)
            .load(callback)
    }

    componentWillMount () {
        this.Sprites = {};
        this.SpritesMap = {};
    }

    resize = () => {
        this.app.renderer.view.style.position = "absolute";
        this.app.renderer.view.style.display = "block";
        this.app.renderer.autoResize = true;
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        this.battleGround.resize(window.innerWidth, window.innerHeight);
    }

    componentDidMount () {
        // 初始化并开始游戏
        this.initGame();
        this.app.stage.addChild(this.gameScene);
        this.app.stage.addChild(this.gameOverScene);
    }

    componentWillUnmount () {
        PIXI.utils.clearTextureCache(); // ?
        loader = loader.reset();
    }

    callback() {

    }

    render () {
        return (
            <div ref={(node)=>this.wrapper = node}>
            </div>
        )
    }
}



Game.defaultProps = {
    // my: [{
    //     soldierType: 'Archer',
    //     count: 200,
    // }],
    // enemy: [{
    //     soldierType: 'ThiefHead',
    //     count: 280,
    // }],
    enemy: [{
        soldierType: 'Archer',
        count: 420
    },{
        soldierType: 'ThiefHead',
        count: 350
    }],
    my: [{
        soldierType: 'Archer',
        count: 620
    },{
        soldierType: 'ThiefHead',
        count: 130
    }],
    sceneType: 'normal',// 地图场景
    dealBattleResult: noop,  // 处理战斗结果回调
    controlSpeed: 1, // 战斗速率
    isOmit: false, // 是否跳过战斗
    showDetail: false,  // 是否显示战斗详细过程文档
    progressHanlder: noop, // 可定制的加载资源过程回调
}

Game.propTypes = {
    enemy: PropTypes.arrayOf(PropTypes.shape({
        soldierType: PropTypes.string,
        count: PropTypes.number
    })),
    my: PropTypes.arrayOf(PropTypes.shape({
        soldierType: PropTypes.string,
        count: PropTypes.number
    })),
    sceneType: PropTypes.string,
    dealBattleResult: PropTypes.func,
    controlSpeed: PropTypes.number,
    isOmit: PropTypes.bool,
    showDetail: PropTypes.bool,
    progressHanlder: PropTypes.func
}

export default Game