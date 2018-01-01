import React from 'react'
import { Row, Col, Card, message, Tabs, Spin } from 'antd';
import PackagePane from './PackagePane'
import api from '../../api'
import './index.less'
import { connect } from 'react-redux';
const TabPane = Tabs.TabPane
class Package extends React.Component {
    constructor () {
        super()
        this.state = {
            loading: false
        }
    }
    componentWillMount () {
        this.setState({
            loading: true
        })
        api({
            method: 'get',
            url: '/items',
            data: {
                id: 1
            }
        }).then(res => {
            this.setState({
                loading: true
            })
            if (res.status === 200){
                console.log(res.data)
            } else {
                console.log(res.message)
            }
        }).catch(error => {
            message.error(error)
            this.setState({
                loading: false
            })
        })
    }
    render () {
        const {data} = this.props
        return (
            <div className="package" style={{ background: '#ECECEC', padding: '30px' }}>
                <Spin spinning={this.state.loading}>
                    <Tabs tabPosition={'top'}>
                        <TabPane tab={'全部'} key='1'>
                            <PackagePane/>
                        </TabPane>
                        <TabPane tab="食物" key="2"><PackagePane/></TabPane>
                        <TabPane tab="药水" key="3"><PackagePane/></TabPane>
                        <TabPane tab="材料" key="4"><PackagePane/></TabPane>
                        <TabPane tab="武器" key="5"><PackagePane/></TabPane>
                        <TabPane tab="防具" key="6"><PackagePane/></TabPane>
                        <TabPane tab="宠物" key="7"><PackagePane/></TabPane>
                        <TabPane tab="特殊" key="8"><PackagePane/></TabPane>
                    </Tabs>
                </Spin>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps,mapDispatchToProps)(Package)