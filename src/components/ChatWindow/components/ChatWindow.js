import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import MessageList from './MessageList'
import UserInput from './UserInput'
import Header from './Header'


class ChatWindow extends Component {
    constructor(props) {
        super(props);
    }

    onUserInputSubmit = (message) => {
        this.props.onUserInputSubmit(message);
    }

    onMessageReceived(message) {
        this.setState({ messages: [...this.state.messages, message] });
    }

    render() {
        let messageList = this.props.messageList;
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
                        teamName={this.props.agentProfile.teamName}
                        imageUrl={this.props.agentProfile.imageUrl}
                        onClose={this.props.onClose}
                    />
                    <MessageList
                        messages={messageList}
                        imageUrl={this.props.agentProfile.imageUrl}
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
