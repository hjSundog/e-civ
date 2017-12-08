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
            <div>
                <Tile>
                    <div className="tile-content">asdasdasd</div>
                    <div className="tile-brand">玩蛇</div>
                </Tile>
                <Tile className="double">
                    <div className="tile-content">asdasdasd</div>
                    <div className="tile-brand">玩蛇</div>
                </Tile>
                <Section title="玩蛇" tip="这是个提示">

                </Section>
            </div>
        )
    }
}
