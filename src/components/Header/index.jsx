import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Row, Col, Icon, Badge, Menu, Dropdown, Avatar, Popover } from 'antd'
import Iconfont from '../Iconfont'
import './index.less'
import { Link, withRouter } from 'react-router-dom'

const { Header } = Layout;

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

// TODO: 把导航栏做成可配置的方式，而不是直接写成JSX


/**
 * 公共头部组件
 *
 * @class commonHeader
 * @extends {React.Component}
 */
class commonHeader extends React.Component {
    constructor () {
        super()
        this.state = {
            current: 'mail'
        }
    }

    handleClick(e) {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    }
    handleLogOut() {
        const {logout} = this.props
        logout().payload.promise.then(() => {
            this.props.history.replace('/login');
        });
    }

    render () {
        const {profile} = this.props
        let username = profile.user ? profile.user.name : '';
        const menu = (
            <Menu>
                <Menu.Item>
                    选项1
                </Menu.Item>
                <Menu.Item>
                    选项2
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.handleLogOut}>注销</a>
                </Menu.Item>
            </Menu>
        );

        const content = (
            <div>
                <p>Content</p>
                <p>Content</p>
                <p>Content</p>
                <p>Content</p>
                <p>Content</p>
            </div>
        );

        return (
            <Header style={{ background: '#fff', padding: 0 }}>
                <Row type="flex" justify="end" align="middle">
                    <Col span={3}>
                        <div className="logo" />
                    </Col>
                    <Col span={15}>
                        <Menu
                            onClick={this.handleClick}
                            selectedKeys={[this.state.current]}
                            mode="horizontal"
                        >
                            <Menu.Item key="mine">
                                <Iconfont type="mine" />我的
                            </Menu.Item>
                            <Menu.Item key="globalmap">
                                <Iconfont type="globalmap" />大地图
                            </Menu.Item>
                            <SubMenu key="square" title={<span><Iconfont type="square" />广场</span>}>
                                <MenuItemGroup title="Item 1">
                                    <Menu.Item key="setting:1">Option 1</Menu.Item>
                                    <Menu.Item key="setting:2">Option 2</Menu.Item>
                                </MenuItemGroup>
                                <MenuItemGroup title="Item 2">
                                    <Menu.Item key="setting:3">Option 3</Menu.Item>
                                    <Menu.Item key="setting:4">Option 4</Menu.Item>
                                </MenuItemGroup>
                            </SubMenu>
                            <Menu.Item key="alipay">
                                <a href="https://ant.design" target="_blank" rel="noopener noreferrer">Navigation Four - Link</a>
                            </Menu.Item>
                        </Menu>
                    </Col>
                    <Col span={3}>
                        <Badge className="header-icon" count={5}>
                            <Link to="/mailbox">
                                <Icon type="mail" />
                            </Link>
                        </Badge>
                        <Popover content={content} title="Title" trigger="click">
                            <Badge className="header-icon" dot>
                                <a href="#">
                                    <Icon type="notification" />
                                </a>
                            </Badge>
                        </Popover>
                    </Col>
                    <Col span={3}>
                        <Dropdown overlay={menu}>
                            <a className="ant-dropdown-link" href="#">
                                <Avatar style={{ verticalAlign: 'middle'}}>{username}</Avatar> <Icon type="down" />
                            </a>
                        </Dropdown>
                    </Col>
                </Row>
            </Header>
        )
    }
}

export default withRouter(commonHeader)
