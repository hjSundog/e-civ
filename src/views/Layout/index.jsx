import React from 'react';
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Layout, Affix , Row, Col} from 'antd';
import { Route, Redirect } from 'react-router-dom';

import { childRoutes } from '@/route'
import authHOC from '@/utils/auth'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import Iconfont from '@/components/Iconfont'
import FeedbackModal from './FeedbackModal'
import {remove_user} from '@/actions/user';

import './index.less';

const { Content } = Layout;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feedbackVisible: false,
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
    handleFeedbackCancel = () => {
        this.setState({
            feedbackVisible: false,
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
                                {/* <Redirect to="/home"/> */}
                                {childRoutes.map((route, index) => (
                                    <Route key={index} path={route.path} component={authHOC(route.component)} exactly={route.exactly} />
                                ))}
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
                    <FeedbackModal
                        visible={feedbackVisible}
                        onCancel={this.handleFeedbackCancel}
                    >
                    </FeedbackModal>
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
