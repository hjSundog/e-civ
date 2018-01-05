import React from 'react'
import { Pagination } from 'antd'
import PropTypes from 'prop-types'
import Animate from 'rc-animate';
import ItemDetailModal from './ItemDetailModal'
import {Card} from 'antd'
// import api from '../../api';

import './index.less'

const gridStyle = {
    width: '100px',
    textAlign: 'center',
    padding: '2px',
    height: '100px'
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

    handleItemDetail(target,e) {
        console.log('enter');
        e.target.nextSibling.style.display = 'block';
        setTimeout(function() {

        }, 1000);
    }

    handleItemDetailFade(e) {
        e.target.nextSibling.style.display = 'none';
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
                                    <img onMouseLeave={this.handleItemDetailFade} onMouseEnter={this.handleItemDetail.bind(this,item)} src={item.item.icon || 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515077691938&di=e6b9bd7d635a7f64e76b024a040f0eff&imgtype=0&src=http%3A%2F%2Fimg.taopic.com%2Fuploads%2Fallimg%2F140619%2F234961-14061921140383.jpg'} alt="item pic"/>
                                    <div className="item-info">
                                        <span>{item.item.name}</span>
                                        <span>{item.item.description}</span>
                                    </div>
                                    <span className="item-count">{'X '+item.count}</span>
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
