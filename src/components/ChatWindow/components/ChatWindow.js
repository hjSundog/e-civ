import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';

import MessageList from './MessageList'
import UserInput from './UserInput'
import Header from './Header'
import api from '@/api'

/**
 * 聊天室可拖动窗口
 * Thinking: Websocket集成在这里还是放Layout里面，这个只是纯展示？ 如果是集成则需要提供新消息到来的事件给父组件。
 * --Decision: 最后决定还是集成在ChatWindow里面，这样可以热插拔
 * TODO: 出现与最小化动画
 * @class ChatWindow
 * @extends {Component}
 */
class ChatWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageList: [],
            // 异步请求广播站信息
            radioStation: {
                name: '加载中...',
                img_url: ''
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        // 打开聊天室时请求广播站信息
        if(this.props.isOpen !== nextProps.isOpen && nextProps.isOpen === true) {
            api({
                url: '/radioStation',
                method: 'get',
                debug: true
            }).then(({data}) => {
                this.setState({
                    radioStation: data
                })
            }).catch(err => {
                console.log(err);
            })
        }
    }

    onUserInputSubmit = (message) => {
        // message组装成本人格式
        this.setState({ messages: [...this.state.messages, message] });
    }

    onMessageReceived = (message) => {
        this.setState({ messages: [...this.state.messages, message] });
    }

    render() {
        let { messageList,radioStation } = this.state;
        let classList = [
            "sc-chat-window",
            (this.props.isOpen ? "opened" : "closed")
        ];
        return (
            <Draggable
                handle=".sc-header"
                axis="both"
                defaultPosition={{x: -600, y: -400}}
                grid={[5, 5]}
                onStart={()=>{}}
                onDrag={()=>{}}
                onStop={()=>{}}
            >
                <div className={classList.join(' ')}>
                    <Header
                        teamName={radioStation.name}
                        imageUrl={radioStation.logo_url}
                        onClose={this.props.onClose}
                    />
                    <MessageList
                        messages={messageList}
                        imageUrl={''}
                    />
                    <UserInput onSubmit={this.onUserInputSubmit}/>
                </div>
            </Draggable>
        );
    }
}

ChatWindow.defaultProps = {
    messageList: [],
    onUserInputSubmit: () => {},
    onClose: () => {}
};

ChatWindow.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        websocket: state.websocket
    }
}

export default withRouter(connect(mapStateToProps)(ChatWindow))
