import React from 'react'
import { Row, Col, Card, message, Tabs, Spin } from 'antd';
import PackagePane from './PackagePane'
import api from '../../api'
import './index.less'
import * as PersonActionCreators from '../../actions/person'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const TabPane = Tabs.TabPane
class Package extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            loading: false,
            items: props.items
        }
    }
    componentWillMount () {
        this.setState({
            loading: true,
        })
        //获取物品
        api({
            method: 'get',
            url: '/persons/1/items',
        }).then(res => {
            this.setState({
                loading: false
            })
            if (res.status === 200){
                const items = res.data.map(item=> {
                    return {
                        item: item,
                        count: 1
                    }
                })
                //console.log(items)
                this.setState({
                    items: items
                })
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
        const {items} = this.state
        return (
            <div className="package">
                <Spin spinning={this.state.loading}>
                    <Tabs tabPosition={'top'}>
                        <TabPane tab={'全部'} key='1'>
                            <PackagePane items={items}/>
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
    const {items = []} = state
    return {
        items: items
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(PersonActionCreators,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Package)