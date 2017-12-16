import React from 'react';
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Layout, Badge , Row, Col} from 'antd';
import { Route, Redirect, Switch } from 'react-router-dom';

import { childRoutes } from '@/route'
import LayoutRouter from '@/route/layout'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import Iconfont from '@/components/Iconfont'
import FeedbackModal from './FeedbackModal'
import ChatWindow from '@/components/ChatWindow';
import {remove_user} from '@/actions/user';

import './index.less';

const { Content } = Layout;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feedbackVisible: false,
            chatroomsVisible: false,
        }
    }

    componentWillMount() {
        const {actions} = this.props;
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
    handleChatroomsMini = () => {
        this.setState({
            chatroomsVisible: false,
        })
    }

    render() {
        const {user, actions} = this.props;
        const { feedbackVisible } = this.state

        return (
            <Layout className="ant-layout-has-sider">
                <Layout>
                    <Header profile={user} logout={actions.remove_user} />
                    <Layout>
                        <Sidebar>Sider</Sidebar>
                        <Content style={{ margin: '0 16px' }}>
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
                </div>
            </Layout>
        );
    }
}

App.propTypes = {
    auth: PropTypes.object,
};

const mapStateToProps = (state) => {
    const { user } = state;
    return {
        user: user ? user : null,
    };
};

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({remove_user}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
