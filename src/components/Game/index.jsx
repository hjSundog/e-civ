import React from 'react'
import Game from 'e-civ-game';
import PropTypes from 'prop-types'
import * as PIXI from 'pixi.js';
import {bindActionCreators} from 'redux'
import {set_game} from "@/actions/game"
// test
// import Data from './test';
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { message } from 'antd'
import noop from '@/utils/noop'
// import { getGameFrames, sendFramesToServer } from '@/api/game'
import { sendFramesToServer } from '@/api/game'
const enemySoldiers = [{
    soldierType: 'Archer',
    count: 420
}, {
    soldierType: 'ThiefHead',
    count: 350
}];

const mySoldiers = [{
    soldierType: 'Archer',
    count: 620
}, {
    soldierType: 'ThiefHead',
    count: 130
}];

class GameScene extends React.Component {
    constructor() {
        super()
        this.state = {
            isPlay: true,
            count: 1,
            isLoading: true
        }
    }

    componentDidMount() {
        const { person, width, height, layout, background, enemy, over, bind, actions } = this.props
        // const own = this.getMySoldiers();
        // const enemy = this.getEnemySoldiers();
        this.gs = new Game();
        this.gs.mountAt(this.node);
        this.gs.setClientOrServer(Game.SERVER, Game.ANIMATION);
        this.gs.setBattleGround(width, height, layout);
        // 设置背景色
        this.gs.setBg(background);
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
            const txt = pre === 'my' ? '恭喜你，我方赢了' : '很遗憾,我方溃败!';
            const Msg = new PIXI.Text(txt, style);
            const center = this.gs.battleGround.getCenter();
            Msg.anchor.set(0.5, 0.5);
            Msg.position.set(center.x, center.y);
            scene.addChild(Msg);
        });

        // 指定结束场景,及其回调
        this.gs.overScene('gameOver', null, null, (result, scene, battleGround) => {
            // console.log('所有的操作都在这里啦！')
            // console.log('gameOver 啦');
            const mal = battleGround.MAL;
            mal.uploadAnimation(mal._generatePng(battleGround.game.view))
            // 传给服务器动画
            sendFramesToServer({
                data: {
                    frames: battleGround.actionFlows,
                    target: enemy.user.id,
                    user: person.id
                }
            }).then(res => {
                if (res.status === 200) {
                    console.log("generate video successfully!");
                    console.log('the url return is: ' + res.data.url);
                    console.log('the filename is '+res.data.filename);
                    console.log('the folder is: '+ res.data.folder);
                    actions.set_game(res.data);
                    typeof over === 'function' ? over(res.data) : null
                } else {
                    message.error('某系地方出错了')
                }
            }).catch(err => {
                message.error(err)
            })
        })
        typeof bind === 'function' ? bind(this) : null
    }

    componentWillUnmount() {
        this.gs.unmount();
    }

    start = () => {
        // 开始前清除上次缓存
        // this.gs.unmount();
        const { self, enemy } = this.props
        const tmy = {
            ...self,
            user: self.user.name
        }
        const tenemy = {
            ...enemy,
            user: enemy.user.name
        }
        this.gs.load(() => {
            this.gs.setSoldiers(tenemy, tmy)
            this.gs.start(tmy.user)
        })
    }

    getMySoldiers = () => {
        const { user } = this.props;
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

    render() {
        return (
            <div ref={(node) => this.node = node}>
            </div>
        )
    }
}


GameScene.defaultProps = {
    enemy: {
        soldiers: enemySoldiers,
        user: {
            name: 'enemy',
            id: '1'
        }
    },
    self: {
        soldiers: mySoldiers,
        user: {
            name: 'my',
            id: '0'
        }
    },
    width: 800,
    height: 600,
    background: '0x4f7dc4',
    layout: {
        row: 5,
        col: 20
    },
    bind: noop,
    over: noop
}

GameScene.propTypes = {
    enemy: PropTypes.shape({
        soldiers: PropTypes.arrayOf(PropTypes.shape({
            soldierType: PropTypes.string,
            count: PropTypes.number
        })),
        user: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string
        })
    }),
    self: PropTypes.PropTypes.shape({
        soldiers: PropTypes.arrayOf(PropTypes.shape({
            soldierType: PropTypes.string,
            count: PropTypes.number
        })),
        user: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string
        })
    }),
    width: PropTypes.number,
    height: PropTypes.number,
    background: PropTypes.string,
    layout: PropTypes.shape({
        col: PropTypes.number,
        row: PropTypes.number
    }),
    over: PropTypes.func,
    bind: PropTypes.func
}

function mapStateToProps(state) {
    const { person, user } = state;
    return {
        user: user || {},
        person: person || {}
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({set_game}, dispatch)
    }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GameScene))