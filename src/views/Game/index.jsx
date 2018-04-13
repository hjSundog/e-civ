import React from 'react'
import Game from 'e-civ-game';
import * as PIXI from 'pixi.js';
// test
import Data from './test';
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { message } from 'antd'
import { getGameFrames } from '@/api/game'

const enemySoldiers = [{
    soldierType: 'Archer',
    count: 420
},{
    soldierType: 'ThiefHead',
    count: 350
}];

const mySoldiers =  [{
    soldierType: 'Archer',
    count: 620
},{
    soldierType: 'ThiefHead',
    count: 130
}];

class GameScene extends React.Component {
    constructor () {
        super()
        this.state = {
            isPlay: true,
            count: 1,
            isLoading: true
        }
    }

    componentDidMount() {
        const own = this.getMySoldiers();
        const enemy = this.getEnemySoldiers();
        const {user} = this.props;

        this.gs = new Game();
        this.gs.mountAt(this.node);
        this.gs.setClientOrServer(Game.CLIENT);
        this.gs.setBattleGround(800, 600, {
            row: 5,
            col: 20
        });
        // 设置背景色
        this.gs.setBg(0x4f7dc4);
        // 创建结束场景
        this.gs.makeScene('gameOver', (pre, scene) => {
            let style = new PIXI.TextStyle({
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
            const txt = pre === 'my'?'恭喜你，我方赢了':'很遗憾,我方溃败!';
            const message = new PIXI.Text(txt, style);
            const center = this.gs.battleGround.getCenter();
            message.anchor.set(0.5, 0.5);
            message.position.set(center.x, center.y);
            scene.addChild(message);
        });

        // 指定结束场景,及其回调
        this.gs.overScene('gameOver', null, null, (result, scene, battleGround)=>{
            console.log('所有的操作都在这里啦！')
            console.log('gameOver 啦');
        })

        this.setState({
            isLoading: true
        });

        getGameFrames({
            own, enemy
        }).then(res => {
            this.setState({
                isLoading: false
            });
            if( res.status === 200) {
                console.log(res.data);
                this.gs.setDriveFrames(res.data);
                // 加载并运行游戏
                this.gs.load(()=>{
                    this.gs.setSoldiers(enemy, own);
                    this.gs.start(user.name);
                })
            }
        }).catch(err => {
            this.setState({
                isLoading: false
            })
            message.error(err)
        })
    }

    componentWillUnmount() {
        this.gs.unmount();
    }


    getMySoldiers = () => {
        const {user} = this.props;
        return {
            soldiers: mySoldiers, 
            user: user.name
        }
    }

    getEnemySoldiers = () => {
        return {
            soldiers: enemySoldiers,
            user: 'enemy'
        }
    }

    render () {
        return (
            <div ref={(node)=>this.node = node}>

            </div>
        )
    }
}


function mapStateToProps (state) {
    const { user } = state;
    return {
        user: user || {},
    };
}


export default withRouter(connect(mapStateToProps)(GameScene))