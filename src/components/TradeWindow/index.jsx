import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import Invitation from './Invitation'
import TradePane from './TradePane'
import {change_trade_target, cancel_invitation, cancel_transaction} from '@/actions/websocket'
import {empty_from_item, empty_to_item} from '@/actions/items'
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
                invitationVisible: true,
            })
        }

        if(nextProps.responseTradePane !== this.props.responseTradePane) {
            this.setState({
                paneVisible: nextProps.responseTradePane
            })
        }
    }

    // shouldComponentUpdate(nextProps) {
    //     // if(this.props.tradingWith.from !== nextProps.tradingWith.from) {
    //     //     return true
    //     // }

    //     // return false
    // }
    
    // 取消邀请,在我的邀请列表中如果对方没回应，一段时间可以取消该邀请
    handleCancle = (target) => {
        const {websocket, trasactions, actions} = this.props;
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
        actions.cancel_transaction(trasactions[target])
    }


    // 接受邀请,在别人邀请列表中接受某个对象的邀请, 现在没做支持多开交易窗口
    handleInvitationReceive = (target) => {
        const {websocket, invitations, actions} = this.props;
        const to = invitations[target].data.from;
        const from = invitations[target].data.to;
        // console.log(target)
        // action 改变交易对象
        actions.change_trade_target({
            from: from,
            to: to
        })
        // 清空上次交易数据
        actions.empty_from_item();
        actions.empty_to_item()
        // 状态设置
        this.setState({
            paneVisible: true,
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
        actions.cancel_invitation(invitations[target])
    }
    // 拒绝邀请，在别人邀请列表中拒绝某个对象的邀请
    handleRefuse = (target) => {
        // console.log(target)
        // ws通知另外一边
        const {websocket, invitations, actions} = this.props
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
        actions.cancel_invitation(invitations[target])
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
        const {trasactions, invitations, isOpen, websocket, tradingWith, items} = this.props;
        const {paneVisible, invitationVisible} = this.state;
        return (
            <div className="TradeWindow" style={{display: isOpen?'block':'none'}}>
                <TradePane websocket={websocket} 
                    visible={paneVisible} 
                    onClose={this.handlePaneClose} 
                    items={items}
                    tradingWith={tradingWith}
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
    isOpen: PropTypes.bool,
    tradingWith: PropTypes.shape({
        from: PropTypes.string,
        to: PropTypes.string
    })
};

function mapStateToProps(state) {
    return {
        trasactions: (state.websocket.trasactions),
        invitations: (state.websocket.invitations),
        items: state.items,
        websocket: (state.websocket.ws),
        tradingWith: state.websocket.tradingWith
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({change_trade_target, cancel_transaction, empty_from_item, empty_to_item, cancel_invitation}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TradeWindow);
