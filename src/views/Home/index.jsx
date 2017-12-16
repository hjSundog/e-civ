import React from 'react'

//import Iconfont from '../../components/Iconfont';
import Tile from '../../components/Tile';
import Section from '../../components/Section';
import './index.less'


export default class Home extends React.Component {
    constructor () {
        super()
    }

    componentWillMount () {
    }

    callback() {

    }

    render () {

        return (
            <div className="home-page">
                <Section title="我的E-civ" tip="这是个提示" sectionExtraContent={<button>test</button>}>
                    <Tile backgroundColor="#7e387d" contentPosition="center">
                        <div className="tile-content">
                            <img src="http://civitas.soobb.com/Resources/Districts/Images/Industry_Tiny.png" />
                            <p>我还没有不动产</p>
                        </div>
                        <div className="tile-brand">玩蛇</div>
                    </Tile>
                    <Tile backgroundColor="#7e387d" contentPosition="center">
                        <div className="tile-content">
                            <img src="http://civitas.soobb.com/Resources/Districts/Images/Industry_Tiny.png" />
                            <p>我还没有不动产</p>
                        </div>
                        <div className="tile-brand">玩蛇</div>
                    </Tile>
                    <Tile backgroundColor="#7e387d" contentPosition="center">
                        <div className="tile-content">
                            <img src="http://civitas.soobb.com/Resources/Districts/Images/Industry_Tiny.png" />
                            <p>我还没有不动产</p>
                        </div>
                        <div className="tile-brand">玩蛇</div>
                    </Tile>
                    <Tile backgroundColor="#7e387d" contentPosition="center">
                        <div className="tile-content">
                            <img src="http://civitas.soobb.com/Resources/Districts/Images/Industry_Tiny.png" />
                            <p>我还没有不动产</p>
                        </div>
                        <div className="tile-brand">玩蛇</div>
                    </Tile>
                    <Tile backgroundColor="#7e387d" contentPosition="center">
                        <div className="tile-content">
                            <img src="http://civitas.soobb.com/Resources/Districts/Images/Industry_Tiny.png" />
                            <p>我还没有不动产</p>
                        </div>
                        <div className="tile-brand">玩蛇</div>
                    </Tile>
                    <Tile backgroundColor="#332134" contentPosition="center">
                        <div className="tile-content">
                            <img src="http://civitas.soobb.com/Resources/Districts/Images/Industry_Tiny.png" />
                            <p>我还没有不动产</p>
                        </div>
                        <div className="tile-brand">玩蛇</div>
                    </Tile>
                    <Tile className="double">
                        <div className="tile-content">asdasdasd</div>
                        <div className="tile-brand">玩蛇</div>
                    </Tile>
                    <Section title="技能总览" tip="显示最高级技能情况">

                    </Section>
                </Section>
                <Section title="技能总览" tip="显示最高级技能情况">

                </Section>
            </div>
        )
    }
}
