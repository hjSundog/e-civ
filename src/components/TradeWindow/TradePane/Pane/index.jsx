import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Layout, Badge, Spin, message, Row, Col, Slider } from 'antd';
import Iconfont from '@/components/Iconfont'
import RResizable from 'react-resizable'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd'
import '@/../node_modules/react-resizable/css/styles.css'
import './index.less'
const Resizable = RResizable.Resizable
// 拖拽功能考虑使用react-dnd来实现
import DragItemWithTarget from '../DragItemWithTarget'
import ItemTypes from '../ItemTypes'


const ItemType = ItemTypes.DragItem

const boxTarget = {
    canDrop() {
        return true;
    },
    drop(props, monitor, component) {
        if (!monitor.didDrop()) {
            console.log('nested didn\'t drop')
        }
        console.log('item ' + monitor.getItem().id + ' result ' + monitor.getDropResult());
        props.addItem(monitor.getItem());
        return { name: 'YourWindow' }
    }
}


class Pane extends Component {
    static propTypes = {
        className: PropTypes.string,
        isDropTarget: PropTypes.bool,
        connectDropTarget: PropTypes.func.isRequired,
        isOver: PropTypes.bool.isRequired,
        canDrop: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        isDropTarget: false,
        data: []
    }

    colCounts = [];

    constructor(props) {
        super(props);
        this.state = {
            colCountKey: 0,
            items: this.props.data
        };
        [1, 2, 3, 4].forEach((value, i) => { this.colCounts[i] = value; });
    }

    componentWillReceiveProps(props) {
        console.log('change items'+props.data);
        this.setState({
            items: props.data
        })
    }

    onColCountChange = () => {
        console.log('click');
        const colCountKey = (this.state.colCountKey + 1) % this.colCounts.length;
        this.setState({ colCountKey });
    }
    addItem = (item) => {
        console.log('is heare')
        this.setState({
            items: [].concat(this.state.items).push(item)
        }) 
    }

    // 如果是目标区域，可以拖进新元素
    addItemIn = (position, newItem) => {
        console.log('add new item ' + newItem.id + ' in ' + position);
        this.addItem(newItem)
    }

    // 本组件内部元素移动
    moveItem = (src, dist) => {
        const { items } = this.state;
        const srcIndex = items.findIndex((target) => {
            return target.id === src.id;
        })

        const distIndex = items.findIndex((target) => {
            return target.id === dist.id
        })

        if (distIndex !== -1) {
            console.log('src id is ' + src.id + ' dist id is ' + dist.id);
            return;
        }
        //this.addItem(srcIndex, dist);
    }

    // 悬浮
    hoverItem = (src, dist) => {

    }




    render() {
        const { colCountKey } = this.state;
        const data = this.state.items;
        const rows = [];
        let counter = 0;
        let cols = [];
        console.log(data.length);
        const colCount = this.colCounts[colCountKey];
        for (let i = 0; i < Math.ceil(data.length / colCount); i++) {
            cols = [];
            for (let j = 0; j < colCount; j++) {
                if (counter >= data.length) {
                    continue;
                }
                cols.push(
                    <Col key={j.toString()} span={24 / colCount}>
                        <DragItemWithTarget target={ItemType} moveItem={this.moveItem} data={data[i * colCount]}>
                            <div className="paneItem">
                                <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3880507419,2968712832&fm=27&gp=0.jpg" />
                                <span>{data[i * colCount + j]['id']}</span>
                            </div>
                        </DragItemWithTarget>
                    </Col>
                );
                counter++;
            }
            rows.push(
                <Row key={'row-' + i}>{cols}</Row>
            )
        }
        const { canDrop, isOver, connectDropTarget, isDropTarget } = this.props
        const isActive = canDrop && isOver

        let backgroundColor = 'none'
        if (isActive) {
            backgroundColor = 'darkgreen'
        } else if (canDrop) {
            backgroundColor = 'none'

        }
        return isDropTarget ? (
            connectDropTarget(
                <div style={{flexGrow: 1, justifyContent:'stretch', backgroundColor }} className=""><BaseVissel onColCountChange={this.onColCountChange} rows={rows} {...this.props} /></div>
            )
        ) : (
            <div style={{flexGrow: 1,justifyContent:'stretch'}}><BaseVissel onColCountChange={this.onColCountChange} rows={rows} {...this.props} /></div>
        );
    }
}

// 基本结构
function BaseVissel({ rows, onColCountChange }) {
    return (
        // <Resizable
        //     axis = 'x'
        //     handleSize = {[5, 5]}
        //     width = {180}
        //     height = {350}
        // >
        <div className="TradeOfPane">
            <div style={{ padding: 10 }}>
                <div className="header"><Iconfont type="clickable" onClick={onColCountChange}></Iconfont><span className="paneName">{'自己的交易窗口'}</span></div>
            </div>
            <div className="trade-item-container">{rows}</div>
            <div className="trade-item-extra">
                <div>额外加价：100 Gold</div>
                <div>价值估算：210 Gold</div>
            </div>
        </div>)
    // </Resizable>)
}


function noop() {
    return () => { }
}

const defaultFunc = {
    connectDropTarget: noop(),
    isOver: false,
    canDrop: false
}



function HOC(source) {

    if (source) {
        return DropTarget(source, boxTarget, (connect, monitor) => ({
            connectDropTarget: connect.dropTarget(),
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
            isDropTarget: true,
        }))(Pane)
        // return <Out {...rest} addItem={addItem} data={data}/>
    }
    // return <Pane {...defaultFunc} {...rest} />
    return Pane
}



export default class DragPane extends Component{

    static propTypes = {
        source: PropTypes.string,
        // addItem: PropTypes.func,
    }

    static defaultProps = {
        source: 'item'
    }
    // 什么鬼啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊AA  啊啊啊 啊啊
    // addItem = (item) => {
    //     console.log('addItem');
    //     this.setState({
    //         data: [...self.state.data, item]
    //     });
    // }

    constructor(props) {
        super(props);
        
        this.state = {
            data: []
        }
    }
    
    render () {
        const {source, ...rest} = this.props;
        const Wrapper = HOC(source, ...rest)
        console.log('pane data'+ this.state.data)
        const self =  this;
        return (
            <div>
                <Wrapper {...rest} addItem={(item) => {
                    self.setState({
                        data: [...self.state.data, item]
                    })
                }} data={self.state.data}/>
            </div>
        )
    }
}

// export default DragPane