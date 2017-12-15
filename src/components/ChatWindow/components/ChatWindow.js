import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import MessageList from './MessageList'
import UserInput from './UserInput'
import Header from './Header'
import Websocket from '@/components/Websocket'


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
                logo_url: '',
                channel: 'asd'
            }

        }
    }

    onUserInputSubmit = (message) => {
        // message组装成本人格式
        this.setState({ messages: [...this.state.messages, message] });
    }

    onMessageReceived = (message) => {
        this.setState({ messages: [...this.state.messages, message] });
    }

    renderWebsocket = () => {
        const channel = this.state.radioStation.channel
        return this.props.isOpen
            ? <Websocket url={`ws://localhost:8089?channel=${channel}&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImFkbWluIiwibWV0YSI6eyJhZ2UiOjIyLCJzZXgiOiJtYWxlIn0sInBlcnNvbl9pZCI6bnVsbCwiaWF0IjoxNTEyMzc5OTc4LCJleHAiOjIyNjk3NjIzNzh9.grCzWUCxgijvOfgecQ-GUD0sssPHSY9bLRX2kYyLO_A`}
                onMessage={this.onMessageReceived}/>
            : null
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
                    {this.renderWebsocket()}

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

export default ChatWindow;
