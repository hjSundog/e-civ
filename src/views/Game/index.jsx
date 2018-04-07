import React from 'react'
import Game from 'e-civ-game';
import * as PIXI from 'pixi.js';
import Data from './test';
const enemy = [{
    soldierType: 'Archer',
    count: 420
},{
    soldierType: 'ThiefHead',
    count: 350
}];

const my =  [{
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
            count: 1
        }
    }

    componentDidMount() {
        this.gs = new Game();
        this.gs.mountAt(this.node);
        this.gs.setClientOrServer(Game.CLIENT);
        this.gs.setBattleGround(800, 600, {
            row: 5,
            col: 20
        });
        // 设置背景色
        this.gs.setBg(0x4f7dc4);
        const d = Data;
        if (!d) {
            return;
        }
        const data = d.data;
        this.gs.setDriveFrames(data);

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

        this.gs.load(()=>{
            this.gs.setSoldiers({
                soldiers: enemy, 
                user: 'enemy'
            }, 
            {
                soldiers: my, 
                user: 'my'
            });
            this.gs.start('my');
        })
    }

    render () {
        return (
            <div ref={(node)=>this.node = node}>

            </div>
        )
    }
}


export default GameScene