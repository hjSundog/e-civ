import React from 'react'
import PropTypes from 'prop-types'
import BattleGround from './battleground'
import Soldiers from './characters'
import _ from 'lodash';
import * as PIXI from 'pixi.js'
import './index.less'
import noop from '@/utils/noop'
import MakeAnimationLoop from './utils/MakeAnimationLoop'

// 想法，传入的参数应该是两个军队，每个军队数据对象包含兵种及每个兵种的数目，当然每个兵种都有最大值
// 先100个为一组，

let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Texture = PIXI.Texture,
    Rectangle = PIXI.Rectangle,
    Container = PIXI.Container,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle,
    TextureCache = PIXI.utils.TextureCache;
    // base = new PIXI.BaseTexture(anyImageObject),
    // texture = new PIXI.Texture(base),
    // sprite = new PIXI.Sprite(texture)

const ROOT_PATH = 'static/images/'

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
        this.battleGround = new BattleGround(800, 600, {row: 5, col: 20}, this.gameScene);
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
            this.message = new Text('start', style);
            this.gameOverScene.addChild(this.message);

            this.battleGround.initGroup('my');
            this.battleGround.addGroupToScene(true);
            this.battleGround.battle();
            // test
            // let testTexture = _.cloneDeep(textures.textures['Archer.png']);
            // testTexture.frame = new Rectangle(0, 0, 48, 64);
            // let testSprite = new PIXI.Sprite(testTexture);
            // testSprite.buttonMode = true;
            // testSprite.interactive = true;

            // let mal = new MakeAnimationLoop(testSprite);
            // mal.loadFrames(textures, 4, 4, 'Archer.png');
            // console.log(mal.frames.length);
            // testSprite.x = 400;
            // testSprite.y = 300;
            // this.gameScene.addChild(testSprite);
            // mal.directAnimationFrames({
            //     start: 8,
            //     end: 11
            // });  
            // testSprite.on('pointerdown', () => {
            //     mal.isStop? mal.resume():mal.pause();
            // })
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
                let solider = new Soldiers[soldierType](cache);
                // 加入容器
                // solider.addToScene(this.gameScene);
                // this.gameScene.addChild(solider.sprite);
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

    // 运行程序
    run = () => {
        requestAnimationFrame(this.run)
        this.gameloop();
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
    enemy: [{
        soldierType: 'Archer',
        count: 400
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