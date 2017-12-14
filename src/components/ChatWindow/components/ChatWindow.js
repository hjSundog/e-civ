import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import MessageList from './MessageList'
import UserInput from './UserInput'
import Header from './Header'


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
                logo_url: ''
            }

        }
    }

    onUserInputSubmit = (message) => {
        this.setState({
            messageList: this.state.messageList.concat(message)
        })
    }

    onMessageReceived(message) {
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
    agentProfile: PropTypes.shape({
        teamName: PropTypes.string.isRequired,
        imageUrl: PropTypes.string.isRequired
    }),
    onClose: PropTypes.func,
    onUserInputSubmit: PropTypes.func,
    messageList: PropTypes.arrayOf(PropTypes.object)
};

export default ChatWindow;
