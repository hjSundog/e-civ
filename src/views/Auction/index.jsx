import React from 'react'
import PropTypes from 'prop-types'
import { message, Tabs, Spin } from 'antd';
import AuctionPane from './AuctionPane'
import api from '../../api'
import './index.less'
// import * as PersonActionCreators from '../../actions/person'
import {init_package}  from '@/actions//items'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const TabPane = Tabs.TabPane
class Package extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            loading: false,
        }
    }
    componentWillMount () {
        // const {user, hasInitialed} = this.props;
        // const url = `/persons/${user.name}/items`
        // if (hasInitialed) {
        //     console.log('已经初始化背包了！！');
        //     return
        // }
        // this.setState({
        //     loading: true,
        // })
        // //获取物品

        // api({
        //     method: 'get',
        //     url: url,
        // }).then(res => {
        //     this.setState({
        //         loading: false
        //     })
        //     if (res.status === 200){
        //         this.props.actions.init_package(res.data.map(item=> {
        //             return {
        //                 item: item,
        //                 count: 1
        //             }
        //         }));
        //     } else {
        //         console.log(res.message)
        //     }
        // }).catch(error => {
        //     message.error(error)
        //     this.setState({
        //         loading: false
        //     })
        // })
    }
    render () {
        const {items} = this.props
        return (
            <div className="auction">
                <Spin spinning={this.state.loading}>
                    <Tabs tabPosition={'top'}>
                        <TabPane tab={'全部物品'} key='1'>
                            <AuctionPane items={items.all}/>
                        </TabPane>
                        <TabPane tab="食物" key="2"><AuctionPane items={items.food}/></TabPane>
                        <TabPane tab="药水" key="3"><AuctionPane items={items.alcohol}/></TabPane>
                        <TabPane tab="材料" key="4"><AuctionPane items={items.material}/></TabPane>
                        <TabPane tab="武器" key="5"><AuctionPane items={items.weapon}/></TabPane>
                        <TabPane tab="防具" key="6"><AuctionPane items={items.armor}/></TabPane>
                        <TabPane tab="宠物" key="7"><AuctionPane items={items.pets}/></TabPane>
                        <TabPane tab="特殊" key="8"><AuctionPane items={items.special}/></TabPane>
                    </Tabs>
                </Spin>
            </div>
        )
    }
}

Package.defaultProps = {
    items: {
        all: [],
        food: [],
        alcohol: [],
        material: [],
        weapon: [],
        armor: [],
        pets: [],
        special: []
    }
}

Package.propTypes = {
    items: PropTypes.shape({
        all: PropTypes.array,
        food: PropTypes.array,
        alcohol: PropTypes.array,
        material: PropTypes.array,
        weapon: PropTypes.array,
        armor: PropTypes.array,
        pets: PropTypes.array,
        special: PropTypes.array
    })
}

function mapStateToProps(state) {
    return {
        items: state.items.auctionItems,
        user: state.auth.user,
    }
}


export default connect(mapStateToProps)(Package)