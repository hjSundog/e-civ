import React from 'react'
import { Pagination } from 'antd'
import PropTypes from 'prop-types'
import Animate from 'rc-animate';
import ItemDetailModal from '@/components/ItemDetailModal'
import ItemContextMenu from '@/components/ItemContextMenu'
import ItemChooser from '../ItemChooser'
import { Card } from 'antd'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { update_person } from '@/actions/person'
import { sell_to_auction } from '@/actions//items'


// import api from '../../api';

import './index.less'

const gridStyle = {
    width: '100px',
    textAlign: 'center',
    padding: '2px',
    height: '100px'
};

const testItem = {
    description: "银闪闪的苹果，可以回复较多生命值",
    details: { type: "Food", apply_count: 1 },
    icon: "",
    name: "sliver apple",
    owner_id: 1,
    rarity: "fine",
    type: "consumable",
    vendor_value: 30,
    _id: 1
}

const extraOp = [{
    action: 'USE',
    action_name: '使用'
}, {
    action: 'TEST',
    action_name: '测试',
}, {
    action: 'AUCTION',
    action_name: '拍卖',
    cb: function (item) {
        // actions here
        const { onAuctionChooser } = this.props;
        onAuctionChooser(item);
        // actions.sell_to_auction(item);
        // console.log('拍卖啦'+item)
    }
}, {
    action: 'DROP',
    action_name: '丢弃'
}]

class PackagePane extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            limit: 10,
            detail: {
                detailVisible: false,
                item: null,
            },
            chooser: {
                chooserVisible: false,
                item: null,
                num: 1,
                endTime: 0
            },
            items: props.items.slice(0, 10)
        }
    }

    handlePageChange = (page, pageSize) => {
        this.setState({
            items: this.props.items.slice((page - 1) * 10, page * 10)
        })
    }
    // 显示详情窗口
    handleShowDetail = (item) => {
        this.setState({
            detail: {
                detailVisible: true,
                item: item
            }
        })
    }

    // 关闭详情窗口
    handleHideDetail = () => {
        this.setState({
            detail: {
                detailVisible: false,
                item: null
            }
        })
    }
    // 显示拍卖设置窗口
    handleShowChooser = (item) => {
        this.setState({
            chooser: {
                chooserVisible: true,
                item: item
            }
        })
    }

    // 关闭拍卖设置窗口
    handleHideChooser = () => {
        this.setState({
            chooser: {
                chooserVisible: false,
                item: null
            }
        })
    }

    // 发起拍卖操作
    handleSellToAuction = (item, setting) => {
        const { actions, websocket, person } = this.props;
        // 获取拍卖设置数据
        const { endValue, startValue, price, count } = setting;
        // 客户端拍卖操作
        //actions.sell_to_auction(item);
        console.log('哈哈拍卖：' + item.name + '啦')
        // websocket 操作
        // websocket.send(JSON.stringify({
        //     source: 'person',
        //     type: 'AUCTION',
        //     data: {
        //         from: person.name,
        //         payload:{

        //         },
        //         startTime: startValue,
        //         endTime: endValue,
        //         item: item,
        //         count: count,
        //         price: price
        //     },
        //     created_at: Date.now()
        // }))
    }

    // 右键菜单单击处理，USE和DROP是自带的，如果不使用自带的传递rebuild参数即可
    handleContextMenuClick = (e, data, target) => {
        const count = parseInt(target.getAttribute('data-count'), 10);
        const { actions, person } = this.props
        // 使用物品处理
        if (data.action === 'USE') {
            console.log('你使用这个物品了');
            Object.entries(data.item.effect).forEach(function (ele) {
                //递归寻找对象是否有这个属性
                function recursion(target) {
                    for (let key in target) {
                        //建相等
                        if (key === ele[0]) {
                            //如果值为对象
                            if (toString.call(target[key]).slice(8, -1) === 'Object') {
                                //建相等,这里先简单的这样做，不考虑深度克隆的情况
                                target[key] = {
                                    ...target[key],
                                    ...ele[1]
                                }
                            } else {
                                target[key] = target[key] + ele[1];
                            }
                        } else if (toString.call(target[key]).slice(8, -1) === 'Object') {
                            recursion(target[key])
                        }

                    }
                }
                recursion(person);
            })

            actions.update_person(person)
        }

        // 扔掉丢弃物品处理
        if (data.action === 'DROP' && count > 0) {
            console.log('你丢弃' + data.item.name + '物品了')
        }

        // 测试
        if (data.action === 'TEST') {
            console.log('这是测试菜单: ' + data.item.description);
        }

        // 右键菜单拍卖
        if (data.action === 'AUCTION') {
            this.handleShowChooser(data.item);
        }

    }

    render() {
        const { items } = this.props;
        const { detail, chooser } = this.state;
        return (
            <div className="item-tab-pane">
                <div className="item-cards">
                    <Card>{
                        items.map((item, index) => {
                            return (<Card.Grid key={index} style={gridStyle} >
                                <ItemContextMenu extraOp={extraOp} onContextMenuClick={this.handleContextMenuClick} id={item.name} onClickMenu={this.handleShowDetail.bind(this, item)} item={item} count={item.count} />
                            </Card.Grid>)
                        })
                    }
                    </Card>
                </div>
                <Animate
                    component=""
                    showProp="visible"
                    transitionAppear
                    transitionName="fade"
                >
                    <ItemDetailModal key="detailModal" visible={detail.detailVisible} item={detail.item} onClose={this.handleHideDetail}></ItemDetailModal>
                </Animate>
                <Animate
                    component=""
                    showProp="visible"
                    transitionAppear
                    transitionName="fade"
                >
                    <ItemChooser key="chooserModal" visible={chooser.chooserVisible} item={chooser.item} onSellToAuction={this.handleSellToAuction} onClose={this.handleHideChooser} />
                </Animate>
                <Pagination defaultCurrent={1} total={this.props.items.length} onChange={this.handlePageChange} />
            </div>
        );
    }
}

PackagePane.defaultProps = {
    items: []
};

PackagePane.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        item: PropTypes.object,
        count: PropTypes.number
    }))
};

function mapStateToProps(state) {
    return {
        person: state.person,
        websocket: state.websocket
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ update_person, sell_to_auction }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PackagePane)
