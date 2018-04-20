import React from 'react'
import PropTypes from 'prop-types'
import { Player } from 'video-react';
import Scene from 'components/Game'
// test
import { withRouter } from 'react-router'
import {Button} from 'antd';
// import { connect } from 'react-redux'
// import { message } from 'antd'
// import { getGameFrames, sendFramesToServer } from '@/api/game'
import "video-react/dist/video-react.css"; // import css


class App extends React.Component {
    constructor () {
        super()
        this.state = {
            isPlay: true,
            count: 1,
            isLoading: true
        }
    }

    componentDidMount() {
       

    }

    componentWillUnmount() {
    }

    handleOver = (data) => {
        console.log('over callback')
        this.data = data
    }

    startGame = () => {
        this.game.start()
    }

    handleClick = () => {
        this.startGame()
    }

    handleBind = (obj) => {
        this.game = obj
    }

    handleDownload = () => {
        // const {url} = this.data
        const url = 'localhost:8800/games/5ad598eea78c451b0c6c0d37@@1/game1524216367972.mp4';
        window.open(url, '_blank')
    }

    render () {
        return (
            <div>
                <Scene 
                    bind={this.handleBind}
                    over={this.handleOver}
                    start={this.startGame}
                />
                <Button type="primary" onClick={this.handleClick}>开始</Button>
                <Button type="primary" onClick={this.handleDownload}>下载</Button>
                {/* <iframe name="download" style={{display: 'none'}}></iframe> */}
                <Player>
                    <source src="localhost:8800/games/videos/5ad598eea78c451b0c6c0d37@@1/game1524216367972.mp4"/>
                </Player>
            </div>

        )
    }
}




export default withRouter(App)