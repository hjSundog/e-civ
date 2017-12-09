import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, matchPath } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Layout, Menu, Icon, Row, Col, Badge, Dropdown, Avatar, Popover } from 'antd'
import { Link } from 'react-router-dom'

const SubMenu = Menu.SubMenu

import './index.less'

const defaultProps = {
  items: []
}

const propTypes = {
  items: PropTypes.array
}

const { Sider } = Layout;

const isActive = (path, history) => {
  return matchPath(path, {
    path: history.location.pathname,
    exact: true,
    strict: false
  })
}

class Sidebar extends React.Component {

  state = {
    openKey: "sub1",
    activeKey: "menu101",
    collapsed: false,
    mode: 'inline',
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      mode: !this.state.collapsed ? 'vertical' : 'inline',
    });
  }

  componentDidMount () {
  }

  componentWillReceiveProps(nextProps) {
    Array.isArray(nextProps.items) && nextProps.items.map((item, i) => {
      Array.isArray(item.child) && item.child.map((node) => {
        if(node.url && isActive(node.url, this.props.history)){
          this.menuClickHandle({
            key: 'menu'+node.key,
            keyPath: ['menu'+node.key, 'sub'+item.key]
          })
        }
      })
    });
  }

	handleLogOut = () => {
		const { logout } = this.props
		logout().payload.promise.then(() => {
			this.props.history.replace('/login');
		});
  }

  menuClickHandle = (item) => {
    this.setState({
      activeKey: item.key
    })
  }

  render () {
    const { items, history } = this.props
    let { activeKey, openKey } = this.state
    // const { profile } = this.props
    // let username = profile.user ? profile.user.name : '';

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
      <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
        <div>
            keke
        </div>
      </Sider>
    )
  }
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

function mapStateToProps(state) {

  return {
    // items: state.menu.items,
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Sidebar))
