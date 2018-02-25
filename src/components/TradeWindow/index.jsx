import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import Invitation from './Invitation'
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
            tradingWith: {},
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.isOpen !== nextProps.isOpen && nextProps.isOpen === true && !this.state.invitationVisible) {
            this.setState({
                invitationVisible: true,
            })
        }
    }
    
    // 取消邀请,在我的邀请列表中如果对方没回应，一段时间可以取消该邀请
    handleCancle = (target) => {
        const {websocket, trasactions} = this.props;
        console.log('现在要取消id为' + trasactions[target].data.from + '的邀请')
        websocket.send(JSON.stringify({
            type: 'INVITATION',
            source: 'person',
            data: {
                from: trasactions[target].data.from,
                to: trasactions[target].data.to,
                operation: 'cancle',
                message: '我取消这个请求了哟~~'
            },
            created_at: new Date().toLocaleDateString()
        })) 
    }


    // 接受邀请,在别人邀请列表中接受某个对象的邀请
    handleInvitationReceive = (target) => {
        const {websocket, invitations} = this.props;
        const to = invitations[target].data.from;
        const from = invitations[target].data.to;
        console.log(target)
        this.setState({
            paneVisible: true,
            tradingWith: invitations[target]
        })
        // ws 通知另外一边
        websocket.send(JSON.stringify({
            source: 'person',
            type: 'INVITATION',
            data: {
                payload: {
                    ...invitations[target].source
                },
                from: from,
                to: to,
                message: '我接受了你拉，来搞事情吧',
                operation: 'receive'
            }
        }))
    }
    // 拒绝邀请，在别人邀请列表中拒绝某个对象的邀请
    handleRefuse = (target) => {
        console.log(target)
        this.setState({
            tradingWith: target
        })
        // ws通知另外一边
        const {websocket, invitations} = this.props
        const to = invitations[target].data.from
        const from = invitations[target].data.to;
        websocket.send(JSON.stringify({
            source: 'person',
            type: 'INVITATION',
            data: {
                from: from,
                to: to,
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
        const {trasactions, invitations, isOpen, websocket, responseTradePane, items} = this.props;
        const {paneVisible, invitationVisible, tradingWith} = this.state;
        return (
            <div className="TradeWindow" style={{display: isOpen?'block':'none'}}>
                <TradePane websocket={websocket} 
                    visible={responseTradePane || paneVisible} 
                    onClose={this.handlePaneClose} 
                    items={items}
                    target={tradingWith}
                />
                <Invitation websocket={websocket} 
                    visible={invitationVisible} 
                    onClose={this.handleInvitationClose} 
                    onTradeOver={this.handleTradeOver} 
                    onReceive={this.handleInvitationReceive} 
                    onRefuse={this.handleRefuse} 
                    onCancle={this.handleCancle} 
                    invitations={invitations} 
                    trasactions={trasactions}
                />
            </div>

        );
    }
}


TradeWindow.defaultProps = {
    trasactions: [],
    invitations: [],
    onClose: () => {},
    isOpen: false,
    responseTradePane: false,
};

TradeWindow.propTypes = {
    onClose: PropTypes.func,
    responseTradePane: PropTypes.bool,
    trasactions: PropTypes.arrayOf(PropTypes.shape({
        data: PropTypes.shape({
            from: PropTypes.string,
            to: PropTypes.string,
            message: PropTypes.string,
            payload: PropTypes.shape({
                name: PropTypes.string,
                level: PropTypes.number
            })
        })
    })),
    invitations: PropTypes.arrayOf(PropTypes.shape({
        data: PropTypes.shape({
            from: PropTypes.string,
            to: PropTypes.string,
            message: PropTypes.string,
            payload: PropTypes.shape({
                name: PropTypes.string,
                level: PropTypes.number
            })
        })
    })),
    items: PropTypes.shape({
        fromItems: PropTypes.shape({
            payload: PropTypes.array,
            extra: PropTypes.array
        }),
        toItems: PropTypes.shape({
            payload: PropTypes.array,
            extra: PropTypes.array
        }),
        packageItems: PropTypes.array
    }).isRequired,
    isOpen: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        trasactions: (state.websocket.trasactions),
        invitations: (state.websocket.invitations),
        items: state.items,
        websocket: (state.websocket.ws),
    }
}

export default connect(mapStateToProps)(TradeWindow);
