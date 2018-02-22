import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Invitation from './Invitation'
import {Layout, Badge , Row, Col, Spin, message} from 'antd';
import Header from '@/components/ChatWindow/components/Header';
import TradePane from './TradePane'
import  './style'
import './index.less'

class TradeWindow extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            paneVisible: false,
            invitationVisible: true,
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.isOpen !== nextProps.isOpen && nextProps.isOpen === true && !this.state.invitationVisible) {
            this.setState({
                invitationVisible: true
            })
        }
    }
    // 接受邀请
    handleInvitationReceive = (target) => {
        const {websocket, trasactions} = this.props
        const to = trasactions[target].from
        console.log(target)
        this.setState({
            paneVisible: true
        })
        // ws 通知另外一边
        websocket.send(JSON.stringify({
            from: 'admin',
            to: to,
            source: {
                ...trasactions[target].source
            },
            type: 'INVITATION',
            data: {
                message: '我接受了你拉，来搞事情吧',
                operation: 'receive'
            }
        }))
    }
    // 拒绝邀请
    handleRefuse = (target) => {
        console.log(target)
        // ws通知另外一边
        const {websocket, trasactions} = this.props
        const to = trasactions[target].from
        websocket.send(JSON.stringify({
            from: 'admin',
            to: to,
            type: 'INVITATION',
            data: {
                message: '我拒绝了你喔',
                operation: 'refuse'
            }
        }))
    }
    // 关闭交易邀请窗口
    handleInvitationClose = () => {
        this.setState({
            invitationVisible: false
        })
    }

    // 处理交易面板窗口
    handleTradeOver = () => {
        this.setState({
            paneVisible: false
        })
    }


    handlePaneClose = () => {
        this.setState({
            paneVisible: false
        })
    }


    render() {
        const {trasactions, isOpen, websocket} = this.props;
        const {paneVisible, invitationVisible} = this.state;
        return (
            <div className="TradeWindow" style={{display: isOpen?'block':'none'}}>
                <TradePane websocket={websocket} visible={paneVisible} onClose={this.handlePaneClose} />
                <Invitation websocket={websocket} visible={invitationVisible} onClose={this.handleInvitationClose} onTradeOver={this.handleTradeOver} onReceive={this.handleInvitationReceive} onRefuse={this.handleRefuse} trasactions={trasactions}/>
            </div>

        );
    }
}


TradeWindow.defaultProps = {
    trasactions: [{
        name: 'mdzz',
        level: 3
    }, {
        name: 'fuck',
        level: 4
    }, {
        name: 'monster',
        level: 54
    }, {
        name: 'boss',
        level: 999
    }],
    onClose: () => {},
    isOpen: false
};

TradeWindow.propTypes = {
    onClose: PropTypes.func,
    trasactions: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        level: PropTypes.number
    })),
    isOpen: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        trasactions: (state.websocket.invitations || []),
        websocket: (state.websocket.ws)
    }
}

export default connect(mapStateToProps)(TradeWindow);
