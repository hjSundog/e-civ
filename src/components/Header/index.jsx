import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Row, Col, Icon, Badge, Menu, Dropdown, Avatar, Popover } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Iconfont from '../Iconfont'
import './index.less'
import { clear_user } from '../../actions/user'
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

    handleClick = (e) => {
        //console.log('click ', e);
        this.setState({
            current: e.key,
        });
        switch(e.key) {
        case 'globalmap':
            this.props.history.replace('/map')
            break
        case 'relationship':
            this.props.history.replace('/relationship')
            break
        case 'items':
            this.props.history.replace('/items')
            break
        case 'auction':
            this.props.history.replace('/auction')
            break
        case 'game':
            this.props.history.replace('/game')
            break;
        default:
            return
        }
    }
    handleLogOut = () => {
        const {clear_user} = this.props
        clear_user()
        this.props.history.replace('/login');
    }

    render () {
        const {user} = this.props
        let username = user ? user.name : '';
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
                            {/* <Menu.Item key="alipay">
                                <a href="https://ant.design" target="_blank" rel="noopener noreferrer">Navigation Four - Link</a>
                            </Menu.Item> */}
                            <Menu.Item key="relationship">
                                我的关系
                            </Menu.Item>
                            <Menu.Item key="items">
                                我的背包
                            </Menu.Item>
                            <Menu.Item key="auction">
                                拍卖行
                            </Menu.Item>
                            {/* <Menu.Item key="game">
                                游戏
                            </Menu.Item> */}
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

        // return (
        //     <Header style={{ background: '#fff', padding: 0 }}>

        //         <Menu
        //             theme="blue"
        //             mode="horizontal"
        //             defaultSelectedKeys={['0']}
        //             style={{lineHeight: '64px'}}
        //         >
        //             {navs.map((nav,index)=>{
        //                 return <Menu.Item key={index}>{nav}</Menu.Item>
        //             })}
        //         </Menu>
        //     </Header>
        // )
    }
}

function mapStateToProps(state) {
    const {user} = state;
    if (user) {
        return {user: user};
    }

    return {user: {}};
}

function mapDispatchToProps(dispatch) {
    return {
        clear_user: bindActionCreators(clear_user, dispatch)
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(commonHeader))
