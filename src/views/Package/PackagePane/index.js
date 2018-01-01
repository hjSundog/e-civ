import React from 'react'
import { Pagination } from 'antd'
import PropTypes from 'prop-types'
import Animate from 'rc-animate';
import ItemDetailModal from './ItemDetailModal'
import {Card} from 'antd'
// import api from '../../api';

import './index.less'

const gridStyle = {
    width: '80px',
    textAlign: 'center',
    padding: '10px'
};
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
        console.log('show');
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
                            return (<Card.Grid key={index} style={gridStyle} onClick={this.handleShowDetail}>
                                <div>
                                    <img src={item.item.icon} alt="item pic"/>
                                    <span>{item.item.name}</span>
                                    <span>{item.count}</span>
                                </div>
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
                    <ItemDetailModal visible={detail.detailVisible} skill={detail.skill} onClose={this.handleHideDetail}></ItemDetailModal>
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
