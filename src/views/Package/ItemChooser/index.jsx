import React from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import Iconfont from '@/components/Iconfont'
import { Input, Col, Select, InputNumber, DatePicker, AutoComplete, Cascader, Button, Progress } from 'antd';
const InputGroup = Input.Group;
const Option = Select.Option;
// import api from '../../api';

import './index.less'

export default class ItemChooser extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: 'relative',
            itemDetail: {}
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

    // 发起拍卖请求
    handleSellAuction = () => {

    }
    // 取消拍卖请求
    handleCancleAuction = () => {

    }

    render() {
        const { item, visible } = this.props
        const style = {
            display: visible ? 'block' : 'none',
        };
        return (
            <Draggable        
            axis="both"
            defaultPosition={{x: -200, y: -0}}
            grid={[5, 5]}
            onStart={()=>{}}
            onDrag={()=>{}}
            onStop={()=>{}}>
                <div className="item-chooser-modal" style={style}>
                    <header>
                        <h1>拍卖设置</h1>
                        <Iconfont className="close" type="close" onClick={this.handleClose}></Iconfont>
                    </header>
                    <section>
                        <div className="item-title">
                            <h2>拍卖物品: {item && item.name}</h2>
                        </div>
                        <div className="item-input">
                            <div>数目:<InputNumber /></div>
                            {this.state.modal === 'relative'?
                                <div>拍卖时间:
                                <InputGroup compact>
                                    <Select defaultValue="am">
                                        <Option value="am">上午</Option>
                                         <Option value="fm">下午</Option>
                                    </Select>
                                    <InputNumber />
                                </InputGroup></div> :
                                <div>拍卖结束时间:<DatePicker />}</div>
                            }
                        </div>
                        <div className="item-op">
                            <Button onClick={this.handleSellAuction}>发布</Button>
                            <Button onClick={this.handleCancleAuction}>取消</Button>
                        </div>
                    </section>
                </div>
            </Draggable>
        );
    }
}

ItemChooser.defaultProps = {
    onClose: () => {},
};

ItemChooser.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.string
    }),
    onClose: PropTypes.func
};
