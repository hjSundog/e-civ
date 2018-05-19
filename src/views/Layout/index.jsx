import React from 'react';
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Layout, Badge, Row, Col, Spin, message, Modal } from 'antd';
import LayoutRouter from '@/route/layout'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import Iconfont from '@/components/Iconfont'
import FeedbackModal from './FeedbackModal'
import ChatWindow from '@/components/ChatWindow';
import TradeWindow from '@/components/TradeWindow'
import Websocket from '@/components/Websocket'
import { add_message, add_invitation, init_websocket, cancel_invitation, change_trade_target } from '@/actions/websocket';
import { init_package, add_to_item, change_to_extra, add_package_items } from '@/actions/items'
import { RetreiveCharacter, UseItem, CreateItem, GetAllItems } from '@/api/person'
import { clear_user, search_user } from '@/actions/user';
import { init_person } from '../../actions/person'
import {empty_to_item, empty_from_item, set_package, init_auction, sell_to_auction, making_bid} from '@/actions/items'
import './index.less';

const { Content } = Layout;
const confirm = Modal.confirm;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feedbackVisible: false,
            chatroomsVisible: false,
            tradeWindowVisible: false,
            responseTradePane: false,
            loading: false
        }
    }
    componentWillMount() {
        const { person, actions, user } = this.props
        // if (!person.id) {
        // 初始化用户
        RetreiveCharacter(user.person_id).then(res => {
            this.setState({
                loading: false
            })

            if (res.status !== 200) {
                message.error(res.data.error)
                return
            }
            actions.init_person(res.data)
        })

    }


    handleFeedbackClick = () => {
        this.setState({
            feedbackVisible: true,
        })
    }
    handleChatroomsClick = () => {
        this.setState({
            chatroomsVisible: !this.state.chatroomsVisible,
        })
    }

    handleTradeClick = () => {
        this.setState({
            tradeWindowVisible: !this.state.tradeWindowVisible,
        })
    }

    handleChatroomsMini = () => {
        this.setState({
            chatroomsVisible: false,
        })
    }

    handleAuction = (tMessage) => {
        const {actions, person, websocket} = this.props;
        if (tMessage.type === 'AUCTION') {
            if (!tMessage.data) {
                return
            }
            switch (tMessage.data.operation) {
            case 'init':
                // 设置
                // console.log(tMessage.data.items);
                actions.init_auction(tMessage.data.items);
                break;
            case 'sell': {
                const target = tMessage.data.items;
                const {data, count} = target;
                actions.sell_to_auction(target);
                // 删除该元素
                UseItem({
                    personId: person.id,
                    itemId: data.id,
                    count: count
                }).then(res => {
                    if (res.status === 200) {
                        actions.set_package(res.data)
                    }
                })
                break;
            }
            case 'makingBid':
                console.log(tMessage.data.target);
                // 更新该数据
                actions.making_bid(tMessage.data.target);
                break;
            case 'error':
                break;
            } 
        }
    }

    handleInvitation = (tMessage) => {
        if (tMessage.type === "INVITATION") {
            if (!tMessage.data) {
                return
            }
            switch (tMessage.data.operation) {
            case 'invite':
                this.props.actions.add_invitation(tMessage);
                break;
            case 'cancle':
                this.props.actions.cancel_invitation(tMessage);
                break;
            case 'refuse':
                this.setState({
                    responseTradePane: false
                })
                // 清空fromItem toItem
                this.props.actions.empty_to_item();
                this.props.actions.empty_from_item();
                break;
            case 'receive':
                // 打开交易窗口
                this.setState({
                    responseTradePane: true
                })
                // 设置交易对象
                this.props.actions.change_trade_target({
                    from: tMessage.data.to,
                    to: tMessage.data.from
                })
                // 删除邀请者的邀请信息
                break;
            case 'trading': {
                if (tMessage.data.extra.length) {
                    this.props.actions.change_to_extra(tMessage.data.extra)
                }
                this.props.actions.add_to_item(tMessage.data.items)
                break;
            }
            case 'search': {
                this.props.actions.search_user(tMessage.data.to)
                break;
            }
            case 'confirm': {
                this.handleConfirmTradePane();
                break;
            }
            case 'hang_up': {
                message.info(tMessage.data.from+' 拒绝了你的这次交易请求！。。。');
                break;
            }
            // 最终确定交易的结果
            case 'trade': {
                const {items, person, actions} = this.props;
                const {fromItems, toItems} = items;
                const {payload} = fromItems;
                const {id} = person;
                // 首先删除元素
                // 然后添加对方给的物品
                // 最后初始化背包
                Promise.all(payload.map(item=> {
                    return new Promise((resolve, reject) => {
                        UseItem({
                            personId: id,
                            itemId: item.id,
                            count: 1
                        }).then(res=> {
                            if (res.status === 200) {
                                resolve(res.data);
                            }else {
                                reject()
                            }
                        })
                    }).then((data)=>{
                        actions.set_package(data)
                    })
                })).then(()=> {
                    return Promise.all(toItems.payload.map(item=> {
                        return new Promise((resolve, reject) => {
                            CreateItem({
                                id: id,
                                item: {
                                    type: item.name,
                                    count: 1
                                }
                            }).then(res=>{
                                if (res.status === 200) {
                                    resolve()
                                } else {
                                    reject()
                                }
                            })
                        })
                    }))
                }).then(()=>{
                    // 显示所有物品
                    GetAllItems(id).then(res=>{
                        if (res.status === 200) {
                            actions.init_package(res.data);
                            // 关闭窗口
                            this.setState({
                                responseTradePane: false
                            })
                            // 清空fromItem toItem
                            this.props.actions.empty_to_item();
                            this.props.actions.empty_from_item();
                        } else {
                            console.log(res.message);
                        }
                    }).catch(err=>{
                        message.error(err);
                    })
                })
                // this.props.actions.add_package_items(tMessage.data.items);
                // 这里可以增加extra 现在不搞
                // 结果保存到数据库
                break
            }
            default:
                return
            }
        } else {
            this.props.actions.add_message(tMessage);
        }
    }

    handleWebsocket = (message) => {
        const tMessage = JSON.parse(message)
        this.handleInvitation(tMessage);
        this.handleAuction(tMessage);
    }

    handleOpenWebsocket = (ws) => {
        this.props.actions.init_websocket(ws)
    }

    handleTradeWindowClose = () => {
        this.setState({
            tradeWindowVisible: false,
        })
    }
 
    // 由于cofirm不是个组件所以不能灵活的控制其状态
    handleConfirmTradePane = () => {
        const {websocket, tradingWith} = this.props
        const {from, to} = tradingWith
        confirm({
            title: '你确定接受这次交易吗?',
            content: '你可以点击确定确认这次交易，也可以点击取消继续调整交易物品！',
            onOk() {
                websocket.send(JSON.stringify({
                    source: 'person',
                    type: 'INVITATION',
                    data: {
                        from: from,
                        to: to,
                        message: '欣然接受了',
                        operation: 'trade'
                    }
                }))
                // return new Promise((resolve, reject) => {
                //     setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                // }).catch(() => console.log('Oops errors!'));
            },
            onCancel() {
                websocket.send(JSON.stringify({
                    source: 'person',
                    type: 'INVITATION',
                    data: {
                        from: from,
                        to: to,
                        message: '丑拒',
                        operation: 'hang_up'
                    }
                }))
            },
        })
    }

    render() {
        const { user, actions, invitations } = this.props;
        const { feedbackVisible, tradeWindowVisible, confirmTradePane } = this.state
        const urlPrifx = 'ws://localhost:8089?token=';
        const token = user['token']

        const url = urlPrifx + token
        return (
            <Layout className="ant-layout-has-sider">
                <Spin size="large" spinning={this.state.loading}></Spin>
                <Layout>
                    <Header profile={user} logout={actions.clear_user} />
                    <Layout>
                        <Sidebar>Sider</Sidebar>
                        <Content>
                            <div style={{ minHeight: 360 }}>
                                {LayoutRouter}
                            </div>
                        </Content>
                    </Layout>
                    <Footer />
                </Layout>
                <div id="toolkit">
                    <div id="feedback" className="toolkit-item" onClick={this.handleFeedbackClick}>
                        <Iconfont type="feedback"></Iconfont>
                        <p>反馈</p>
                    </div>
                    <Badge count={4}>
                        <div id="chatrooms" className="toolkit-item" onClick={this.handleChatroomsClick}>
                            <Iconfont type="chatrooms"></Iconfont>
                            <p>聊天室</p>
                        </div>
                    </Badge>
                    <div style={{ backgroundColor: '#0f90ff', width: '45px' }}>
                        <Badge count={invitations.length}>
                            <div id="tradesaction" className="toolkit-item" onClick={this.handleTradeClick}>
                                <Iconfont type="trade"></Iconfont>
                                <p>交易所</p>
                            </div>
                        </Badge>
                    </div>
                    <FeedbackModal
                        visible={feedbackVisible}
                        onCancel={this.handleFeedbackCancel}
                    >
                    </FeedbackModal>
                    <ChatWindow
                        agentProfile={{
                            teamName: 'react-live-chat',
                            imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
                        }}
                        onClose={this.handleChatroomsMini}
                        isOpen={this.state.chatroomsVisible}
                    />
                    <TradeWindow onClose={this.handleTradeWindowClose} isOpen={tradeWindowVisible} responseTradePane={this.state.responseTradePane} />
                    <Websocket url={url}
                        onMessage={this.handleWebsocket}
                        onOpen={this.handleOpenWebsocket}
                        debug={true} />
                </div>
            </Layout>
        );
    }
}

App.propTypes = {
    auth: PropTypes.shape({
        user: PropTypes.shape({
            name: PropTypes.string
        })
    }),
};

const mapStateToProps = (state) => {
    const { user } = state;
    return {
        user: user,
        invitations: state.websocket.invitations,
        person: state.person,
        websocket: state.websocket.ws,
        tradingWith: state.websocket.tradingWith,
        items: state.items
    };
};

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({ 
        add_package_items, 
        search_user, 
        add_to_item, 
        change_to_extra, 
        change_trade_target, 
        init_package, 
        init_websocket, 
        cancel_invitation, 
        add_invitation, 
        add_message, 
        init_person, 
        empty_from_item, 
        empty_to_item,
        set_package,
        init_auction,
        sell_to_auction,
        making_bid
    }, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
