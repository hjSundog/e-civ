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
            itemDetail: {},
            startValue: null,
            endOpen: false,
            endValue: null,
            price: 0,
            count: 1,
        }
    }

    componentDidMount() {
        // 更新itemDetail
    }

    componentWillReceiveProps(nextProps) {
        // 第一次
        if (!this.props.item) {
            return;
        }
        // 关闭modal
        if (!nextProps.item) {
            return;
        }
        if (this.props.item.name !== nextProps.item.name) {
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
        // 拍卖设置属性获取
        const {endValue, startValue, price, count} = this.state
        const setting = {endValue, startValue, price, count}
        if (!endValue) {
            alert('请输入截止日期')
            return;
        }

        if (!startValue) {
            setting.startValue = Date.now()
        } else {
            setting.startValue = startValue.format('x');
        }
        // 转为时间戳
        setting.endValue = endValue.format('x')
        typeof this.props.onSellToAuction === 'function' ? this.props.onSellToAuction(this.props.item, setting) : null;
    }
    // 取消拍卖请求
    handleCancleAuction = () => {
        typeof this.props.onClose === 'function' ? this.props.onClose() : null;
    }


    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
          return false;
        }
        return startValue.valueOf() > endValue.valueOf();
      }
    
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
          return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    
    onChange = (field, value) => {
        this.setState({
          [field]: value,
        });
    }
    
    onStartChange = (value) => {
        this.onChange('startValue', value);
    }
    
    onEndChange = (value) => {
        this.onChange('endValue', value);
    }
    
    handleStartOpenChange = (open) => {
        if (!open) {
          this.setState({ endOpen: true });
        }
    }
    
    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }
    

    // 价格改变
    onPriceChange = (value) => {
        this.setState({price: value})
    }

    // 数目改变
    onCountChange = (value) => {
        this.setState({count: value})
    }

    render() {
        const { item, visible } = this.props
        const style = {
            display: visible ? 'block' : 'none',
        };
        const { startValue, endValue, endOpen } = this.state;
        return (
            <Draggable
                axis="both"
                defaultPosition={{ x: -200, y: -0 }}
                grid={[5, 5]}
                onStart={() => { }}
                onDrag={() => { }}
                onStop={() => { }}>
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
                            <div>数目:<InputNumber onChange={this.onCountChange} min={1} defaultValue={1} /></div>
                            <div className="item-time-picker">
                                <DatePicker
                                    disabledDate={this.disabledStartDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={startValue}
                                    placeholder="Start"
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange}
                                />
                                <DatePicker
                                    disabledDate={this.disabledEndDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={endValue}
                                    placeholder="End"
                                    onChange={this.onEndChange}
                                    open={endOpen}
                                    onOpenChange={this.handleEndOpenChange}
                                />
                            </div>
                            <div>起始价:<InputNumber min={0} defaultValue={0} onChange={this.onPriceChange} /></div>
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
    onClose: () => { },
    onSellToAuction: () => { },
    visible: false,
    item: {
        description: "测试",
        icon: "",
        name: "默认数据",
        rarity: "fine",
        type: "consumable"
    }
}

ItemChooser.propTypes = {
    item: PropTypes.shape({
        description: PropTypes.string,
        icon: PropTypes.string,
        name: PropTypes.string,
        rarity: PropTypes.string,
        type: PropTypes.string
    }),
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    onSellToAuction: PropTypes.func,
};
