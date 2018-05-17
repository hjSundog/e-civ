import React from 'react'
import PropTypes from 'prop-types'
import { Player } from 'video-react';
import Scene from 'components/Game'
import {connect} from 'react-redux';
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
            isPlay: false,
            count: 1,
            isLoading: true
        }
    }

    componentDidMount() {
    

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.game !== this.props.game) {
            const {folder, filename} = nextProps.game;
            if (this.player) {
                this.player.load(`http://localhost:8800/games/videos/${folder}/${filename}`)
            }
        }
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
        this.setState({
            isPlay: false
        }, ()=>{
            this.startGame()
        })
    }

    handleBind = (obj) => {
        this.game = obj
    }

    handleDownload = () => {
        // const {url} = this.data
        const {game} = this.props;
        const prefix = 'localhost:8800/';
        let url = prefix + game.url;
        url = url.split('&&').join('@@');
        console.log(url);
        let a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('target','_blank');
        a.click();
    }

    handlePlay = () => {
        this.setState({
            isPlay: true
        })
    }

    render () {
        const {game} = this.props;
        const {folder, filename} = game;
        const {isPlay} = this.state;
        return (
            <div>
                {
                    isPlay?(
                    <Player fluid={false} width={800} height={600} ref={(node)=>this.player=node}>
                        <source src={`http://localhost:8800/games/videos/${folder}/${filename}`}/>
                    </Player>)
                    :(
                        <Scene 
                            bind={this.handleBind}
                            over={this.handleOver}
                            start={this.startGame}
                    />
                    )
                }
                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                    <Button type="primary" onClick={this.handleClick}>开始</Button>
                    <Button type="primary" onClick={this.handleDownload}>下载</Button>
                    <Button type="primary" onClick={this.handlePlay}>播放</Button>
                </div>
            </div>

        )
    }
}

function mapStateToProps(state) {
    return {
        game: state.game
    }
}



export default connect(mapStateToProps)(App)