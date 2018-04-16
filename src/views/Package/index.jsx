import React from 'react'
import PropTypes from 'prop-types'
import { message, Tabs, Spin } from 'antd';
import PackagePane from './PackagePane'
import {GetAllItems} from '@/api/person'
import './index.less'
// import * as PersonActionCreators from '../../actions/person'
import {init_package}  from '@/actions/items'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const TabPane = Tabs.TabPane

const ItemTypes = {
    '全部': 'ALL',
    '消耗品': 'Consumable',
    '武器': 'Weapon',
    '材料': 'MaterialCraft',
    '防具': 'Armor',
    '宠物': 'MiniPet',
    '特殊': ['Bag', 'Container']
}

const extractItems = (type, storage) => {
    if (typeof type === 'string') {
        if (type === 'ALL') {
            return storage;
        }
        return storage.filter(item => {
            return item.type === type
        })
    }
    let rt = [];
    type.forEach(t => {
        rt = [...rt, ...storage.filter(item => {
            return item.type === t
        })]
    })
    return rt
}

class Package extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            loading: false,
        }
    }
    componentWillMount () {
        const {person, hasInitialed} = this.props;
        // if (hasInitialed) {
        //     console.log('已经初始化背包了！！');
        //     return
        // }
        this.setState({
            loading: true,
        })
        //获取物品

        GetAllItems(person.id).then(res => {
            this.setState({
                loading: false
            })
            if (res.status === 200){
                this.props.actions.init_package(res.data);
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
        const {items} = this.props
        const Panes = Object.entries(ItemTypes).map(type => {
            return (<TabPane tab={type[0]} key={type[1]}>
                <PackagePane items={extractItems(type[1], items)} />
            </TabPane>)
        })
        return (
            <div className="package">
                <Spin spinning={this.state.loading}>
                    <Tabs tabPosition={'top'}>
                        {Panes}
                    </Tabs>
                </Spin>
            </div>
        )
    }
}

Package.defaultProps = {
    items: [],
    hasInitialed: false,
}

Package.propTypes = {
    items: PropTypes.array,
    hasInitialed: PropTypes.bool
}

function mapStateToProps(state) {
    return {
        items: state.items.packageItems,
        person: state.person,
        hasInitialed: state.items.hasInitialed
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({init_package},dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Package)
