import React from 'react'
import { Pagination } from 'antd'
import PropTypes from 'prop-types'
import Animate from 'rc-animate';
import ItemDetailModal from '@/components/ItemDetailModal'
import ItemContextMenu from '@/components/ItemContextMenu'
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
            items: props.items.slice(0,10)
        }
    }

    handlePageChange = (page, pageSize) => {
        this.setState({
            items: this.props.items.slice((page-1)*10, page*10)
        })
    }

    handleShowDetail = (item) => {
        this.setState({
            detail: {
                detailVisible: true,
                item: item
            }
        })
    }
    handleHideDetail = () => {
        this.setState({
            detail: {
                detailVisible: false,
                item: null
            }
        })
    }

    render() {
        const { items } = this.props;
        const {detail } = this.state;
        return (
            <div className="item-tab-pane">
                <div className="item-cards">
                    <Card>{
                        items.map((item, index) => {
                            return (<Card.Grid key={index} style={gridStyle} >
                                <ItemContextMenu id={item.item.name} cb={this.handleShowDetail.bind(this, item.item)} item={item.item} count={item.count}/>
                            </Card.Grid>)
                        })   
                    }
                    <Card.Grid style={gridStyle} >
                        <ItemContextMenu extraOp={extraOp} id='test' cb={this.handleShowDetail.bind(this, testItem)} item={testItem} count={3}/>
                    </Card.Grid>
                    </Card>
                </div>
                <Animate
                    component=""
                    showProp="visible"
                    transitionAppear
                    transitionName="fade"
                >
                    <ItemDetailModal visible={detail.detailVisible} item={detail.item} onClose={this.handleHideDetail}></ItemDetailModal>
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
