import React from 'react'
import PropTypes from 'prop-types'
import Iconfont from '@/components/Iconfont'
import { Button, Progress } from 'antd'
// import api from '../../api';

import './index.less'

export default class ItemDetailModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            itemDetail: null
        }
    }

    componentDidMount() {
        // 更新itemDetail
    }

    componentWillReceiveProps(nextProps) {
        // 第一次
        if(!this.props.item) {
            return;
        }
        // 关闭modal
        if(!nextProps.item) {
            return;
        }
        if(this.props.item.name !== nextProps.item.name) {
            // 更新itemDetail
            this.setState({
                itemDetail: nextProps.item
            })
        }
    }

    handleClose = () => {
        this.props.onClose()
    }

    render() {
        const { item, visible } = this.props
        const style = {
            display: visible ? 'block' : 'none',
        };
        return (
            <div className="item-detail-modal" style={style}>
                <header>
                    <h1>物品详情</h1>
                    <Iconfont className="close" type="close" onClick={this.handleClose}></Iconfont>
                </header>
                <section>
                    <div className="item-title">
                        <h2>{item && item.name}</h2>
                    </div>
                    <div className="item-detail">
                        <p>{item ? item.description : "加载中..."}</p>
                    </div>
                </section>
            </div>
        );
    }
}

ItemDetailModal.defaultProps = {
    onClose: () => {},
};

ItemDetailModal.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.string
    }),
    onClose: PropTypes.func
};
