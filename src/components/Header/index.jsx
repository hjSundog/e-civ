import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Menu } from 'antd'
import './index.less'
import { Link, withRouter } from 'react-router-dom'

const { Header } = Layout;

class commonHeader extends React.Component {
    constructor() {
        super()
    }

    render() {
        const {navs} = this.props;


        return (
            <Header style={{ background: '#fff', padding: 0 }}>
			
                <Menu 
                    theme="blue"
                    mode="horizontal"
                    defaultSelectedKeys={['0']}
                    style={{lineHeight: '64px'}}
                >
                    {navs.map((nav,index)=>{
                        return <Menu.Item key={index}>{nav}</Menu.Item>
                    })}
                </Menu>
            </Header>
        )
    }
}

export default withRouter(commonHeader)
