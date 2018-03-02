import React from 'react'
import { Pagination } from 'antd'
import PropTypes from 'prop-types'
import Animate from 'rc-animate';
import ItemDetailModal from '@/components/ItemDetailModal'
import ItemContextMenu from '@/components/ItemContextMenu'
import ItemChooser from '../ItemChooser'
import {Card} from 'antd'

// import api from '../../api';

import './index.less'

const gridStyle = {
    width: '100px',
    textAlign: 'center',
    padding: '2px',
    height: '100px'
};

const testItem = {
    description:"银闪闪的苹果，可以回复较多生命值",
    details:{type: "Food", apply_count: 1},
    icon: "",
    name: "sliver apple",
    owner_id: 1,
    rarity: "fine",
    type: "consumable",
    vendor_value: 30,
    _id: 1
}

const extraOp = [{
    action: 'TEST',
    action_name: '测试',
    cb: function(item) {
        console.log('这是测试菜单: ' + item.description);
    }
}, {
    action: 'AUCTION',
    action_name: '拍卖',
    cb: function(item) {
        // actions here
        const {actions, onAuctionChooser} = this.props;
        onAuctionChooser(item);
        // actions.sell_to_auction(item);
        // console.log('拍卖啦'+item)
    }
}]

export default class PackagePane extends React.Component {
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
                item: null
            },
            items: props.items.slice(0,10)
        }
    }

    handlePageChange = (page, pageSize) => {
        this.setState({
            items: this.props.items.slice((page-1)*10, page*10)
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

    render() {
        const { items } = this.props;
        const {detail, chooser } = this.state;
        return (
            <div className="item-tab-pane">
                <div className="item-cards">
                    <Card>{
                        items.map((item, index) => {
                            return (<Card.Grid key={index} style={gridStyle} >
                                <ItemContextMenu id={item.item.name} onAuctionChooser={this.handleShowChooser} cb={this.handleShowDetail.bind(this, item.item)} item={item.item} count={item.count}/>
                            </Card.Grid>)
                        })   
                    }
                    <Card.Grid style={gridStyle} >
                        <ItemContextMenu extraOp={extraOp} id='test' onAuctionChooser={this.handleShowChooser} cb={this.handleShowDetail.bind(this, testItem)} item={testItem} count={3}/>
                    </Card.Grid>
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
                    <ItemChooser key="chooserModal" visible={chooser.chooserVisible} item={chooser.item} onClose={this.handleHideChooser}/>
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
