import React from 'react';
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Layout, Badge , Row, Col, Spin, message} from 'antd';
import { Route, Redirect, Switch } from 'react-router-dom';

import { childRoutes } from '@/route'
import LayoutRouter from '@/route/layout'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import Iconfont from '@/components/Iconfont'
import FeedbackModal from './FeedbackModal'
import ChatWindow from '@/components/ChatWindow';
import TradeWindow from '@/components/TradeWindow'
import Websocket from '@/components/Websocket'
import {add_message} from '@/actions/websocket';

import {remove_user} from '@/actions/user';
import { init_person } from '../../actions/person'
import api from '../../api'
import './index.less';

const { Content } = Layout;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feedbackVisible: false,
            chatroomsVisible: false,
            tradeWindowVisible: false,
            loading: true
        }
    }
    componentWillMount() {
        const {actions, user} = this.props
        this.setState({
            loading: true
        })
        // actions.init_person(this.props.person);
        // this.setState({
        //     loading: false
        // })
        api({
            url: `/persons/${user?user.person_id:1}`,
            method: 'get',
        }).then(res => {
            this.setState({
                loading: false
            })
            if (res.status !== 200) {
                message.error(res.data.error);
            }
            if (res.status === 200) {
                console.log('init person')
                actions.init_person(res.data)
            }
        }).catch(err => {
            this.setState({
                loading: false
            });
            message.error(err);
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


    handleWebsocket = (message) => {
        console.log(JSON.parse(message))
        this.props.actions.add_message(JSON.parse(message));
    }

    handleTradeWindowClose = () => {
        this.setState({
            tradeWindowVisible: false,
        })
    }


    render() {
        const {user, actions} = this.props;
        const { feedbackVisible, tradeWindowVisible } = this.state

        return (
            <Layout className="ant-layout-has-sider">
                <Spin size="large" spinning={this.state.loading}></Spin>
                <Layout>
                    <Header profile={user} logout={actions.remove_user} />
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
                    <div style={{backgroundColor: '#0f90ff', width: '45px'}}>
                        <Badge count={1}>
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
                    <TradeWindow onClose={this.handleTradeWindowClose} isOpen={tradeWindowVisible}/>
                    <Websocket url='ws://localhost:8089?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImFkbWluIiwibWV0YSI6eyJhZ2UiOjIyLCJzZXgiOiJtYWxlIn0sInBlcnNvbl9pZCI6bnVsbCwiaWF0IjoxNTEyMzc5OTc4LCJleHAiOjIyNjk3NjIzNzh9.grCzWUCxgijvOfgecQ-GUD0sssPHSY9bLRX2kYyLO_A'
                        onMessage={this.handleWebsocket}/>
                </div>
            </Layout>
        );
    }
}

App.propTypes = {
    auth: PropTypes.object,
};

const mapStateToProps = (state) => {
    const { auth } = state;
    return {
        user: auth.user ? auth.user : null,
        person: state.person
    };
};

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({remove_user, add_message, init_person}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
