import React from 'react';
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Layout, Affix , Row, Col} from 'antd';
import { Route, Redirect } from 'react-router-dom';

import { childRoutes } from '@/route'
import authHOC from '@/utils/auth'
import Header from '@/components/Header'
import NavPath from '@/components/NavPath'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import {logout} from '@/actions/user';

import './index.less';

const { Content } = Layout;

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {actions} = this.props;
    }

    render() {
        const {auth, navpath, actions} = this.props;

        return (
            <Layout className="ant-layout-has-sider">
                <Layout>
                    <Header profile={auth} logout={actions.logout} />
                    <Layout>
                        <Sidebar>Sider</Sidebar>
                        <Content style={{ margin: '0 16px' }}>
                            <NavPath data={navpath} />
                            <div style={{ minHeight: 360 }}>
                                <Redirect to="/home"/>
                                {childRoutes.map((route, index) => (
                                    <Route key={index} path={route.path} component={authHOC(route.component)} exactly={route.exactly} />
                                ))}
                            </div>
                        </Content>
                    </Layout>
                    <Footer />
                </Layout>
            </Layout>
        );
    }
}

App.propTypes = {
    auth: PropTypes.object,
    navpath: PropTypes.array
};

const mapStateToProps = (state) => {
    const { user, menu } = state;
    return {
        user: user ? user : null,
        navpath: menu.navpath
    };
};

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({fetchProfile, logout}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
