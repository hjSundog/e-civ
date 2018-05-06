import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Layout, Badge, Spin, message, Row, Col, Slider, Input } from 'antd';
import Iconfont from '@/components/Iconfont'
import RResizable from 'react-resizable'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd'
import '@/../node_modules/react-resizable/css/styles.css'
import './index.less'
import * as ItemsActionCreators from '@/actions/items'
const Resizable = RResizable.Resizable
// 拖拽功能考虑使用react-dnd来实现
import DragItem from '../DragItem'
import Item from '../Item'
import ItemTypes from '../ItemTypes'


const ItemType = ItemTypes.DragItem
const  DragItemWithTarget = DragItem(ItemType)(Item)

const boxTarget = {
    canDrop() {
        return true;
    },
    drop(props, monitor, component) {
        if (!monitor.didDrop()) {
            console.log('nested didn\'t drop')
        }
        const targetItem = monitor.getItem();
        //console.log('item ' + targetItem.id + ' result ' + monitor.getDropResult());
        if(props.data.findIndex((item) => {
            return item.name === targetItem.name
        }) !== -1) {
            //console.log('switch '+targetItem.id);
            // props.switchItem()
        } else {
            
            props.addItem(monitor.getItem());
        }
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
        colCountKey: PropTypes.number.isRequired,
        colCounts: PropTypes.array.isRequired,
        title: PropTypes.string
    };

    static defaultProps = {
        isDropTarget: false,
        isOver: false,
        canDrop: false,
        data: [],
        colCountKey: 0,
        colCounts: [],
        title: '交易窗口'
    }


    constructor(props) {
        super(props);
        this.state = {
            colCountKey: this.props.colCountKey,
            items: this.props.data
        };
    }

    componentWillReceiveProps(props) {
        //console.log('change items'+props.data);
        this.setState({
            items: props.data,
            colCountKey: props.colCountKey,
            colCounts: props.colCounts
        })
    }

    onColCountChange = () => {
        this.props.onColCountChange();
    }

    // addItem = (item) => {
    //     console.log('is heare')
    //     this.setState({
    //         items: this.state.items.spli
    //     })
    // }

    // 如果是目标区域，可以拖进新元素
    addItemIn = (position, newItem) => {
        //console.log('add new item ' + newItem.id + ' in ' + position);
        const items = [...this.state.items];
        items.splice(position, 0, newItem)
        this.setState({
            items: items
        })
    }

    swithcItem = (tIndex, dIndex, target, dist) => {
        const items = [...this.state.items];
        items[tIndex] = {...dist};
        items[dIndex] = {...target}
        //console.log('switch ' + target.id + ' to ' + dist.id)
        this.props.changeState(items)
    }

    // TODO: 最后根据数据结构来决定使用的属性判断
    // 本组件内部元素移动 这里使用
    moveItem = (src, dist) => {
        const { items } = this.state;
        const srcIndex = items.findIndex((target) => {
            return target._id === src._id;
        })

        const distIndex = items.findIndex((target) => {
            return target._id === dist._id
        })

        if (srcIndex === -1) {
            //console.log('src id is ' + src.id + ' dist id is ' + dist.id + ' length is '+items.length);
            this.addItemIn(distIndex, dist);
            return;
        }
        this.swithcItem(srcIndex, distIndex, src, dist);

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
        const colCount = this.props.colCounts[colCountKey];
        for (let i = 0; i < Math.ceil(data.length / colCount); i++) {
            cols = [];
            for (let j = 0; j < colCount; j++) {
                if (counter >= data.length) {
                    continue;
                }
                cols.push(
                    <Col key={j.toString()} span={24 / colCount}>
                        <DragItemWithTarget target={ItemType} moveItem={this.moveItem} data={data[i * colCount+j]}>
                            <div className="paneItem">
                                <img src= {data[i * colCount + j].icon || "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3880507419,2968712832&fm=27&gp=0.jpg"} />
                                <span>{data[i * colCount + j]['name']}</span>
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
                <div style={{flexGrow: 1, justifyContent:'stretch', display: 'flex', flexDirection: 'column', backgroundColor }} className="">
                    <BaseVissel onColCountChange={this.onColCountChange} rows={rows} {...this.props} />
                </div>
            )
        ) : (
            <div style={{flexGrow: 1,justifyContent:'stretch', display: 'flex', flexDirection: 'column'}}>
                <BaseVissel onColCountChange={this.onColCountChange} rows={rows} {...this.props} />
            </div>
        );
    }
}

// 基本结构
function BaseVissel({ rows, onColCountChange, title, canEditable}) {
    return (
        <Resizable
            axis = 'x'
            handleSize = {[5, 5]}
            width = {180}
            height = {350}
        >
            <div className="TradeOfPane">
                <div style={{ padding: 10, background: '#02e4ef' }}>
                    <div className="header"><Iconfont type="clickable" onClick={onColCountChange}></Iconfont><span className="paneName">{title}</span></div>
                </div>
                <div className="trade-item-container">{rows}</div>
                <div className="trade-item-extra">
                    <div style={{display: 'flex'}}>
                        <span className="extra-des">额外加价:</span>
                        {canEditable?
                            (<span className="extra-value"><Input placeholder="0 gold" /></span>)
                            :(<span className="total-value">210 Gold</span>)
                        }
                    </div>
                    <div>
                        <span className="extra-des">价值估算:</span>
                        <span className="total-value">210 Gold</span>
                    </div>
                </div>
            </div>
        </Resizable>)
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
    // 保证有source属性的都是可以放置拖动元素的组件，其来源决定于source属性
    if (source) {
        return DropTarget(source, boxTarget, (connect, monitor) => ({
            connectDropTarget: connect.dropTarget(),
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
            // 这里自定义属性
            isDropTarget: true, 
            canEditable: source === ItemTypes.DragItem? true: false
        }))(Pane)
    }
    return Pane
}



class DragPane extends Component{

    static propTypes = {
        source: PropTypes.string,
    }

    static defaultProps = {
        source: 'item'
    }

    colCounts = [];


    constructor(props) {
        super(props);
        [1, 2, 3, 4].forEach((value, i) => { this.colCounts[i] = value; });
        this.state = {
            data: this.props.data.payload,
            extra: this.props.data.extra,
            colCountKey: 0
        }
    }

    componentWillReceiveProps (nextProps) {
        // if(this.props.source === '')
        if(this.props.data !== nextProps.data) {
            this.setState({
                data: nextProps.data.payload,
                extra: nextProps.data.extra
            })
        }
    }

    // 改变额外加价
    changeExtra = (newExtra) => {

    }

    addItem = (item) => {
        // this.setState({
        //     data: [...this.state.data, item]
        // })
        // 这里add_from_items action
        const {actions, websocket, tradingWith} = this.props;
        actions.add_from_item(item)
        console.log('will send %s to %s', tradingWith.from, tradingWith.to);
        websocket.send(JSON.stringify({
            type: 'INVITATION',
            source: 'person',
            data: {
                ...tradingWith,
                items: [...[item]],
                extra: [],
                operation: 'trading',
                message: '收到新的变化了，哈哈哈'
            },
            created_at: new Date().toLocaleDateString()
        }))
    }

    changeState = (newState)=> {
        this.setState({
            data: newState
        })
    }

    onColCountChange = () => {
        const colCountKey = (this.state.colCountKey + 1) % this.colCounts.length;
        this.setState({ colCountKey });
    }

    render () {
        const {source, ...rest} = this.props;
        const Wrapper = HOC(source, ...rest)
        const self =  this;
        return (
            <div style={{display: 'flex', flexGrow: 1}}>
                <Wrapper colCountKey={this.state.colCountKey}
                    colCounts={this.colCounts} 
                    onColCountChange={self.onColCountChange} 
                    {...rest}
                    addItem={this.addItem}
                    data={self.state.data}
                    changeState={this.changeState}/>
            </div>
        )
    }
}

function mapStateToState(state){
    return {
        websocket: state.websocket.ws,
        tradingWith: state.websocket.tradingWith
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({...ItemsActionCreators}, dispatch)
    }
}

export default connect(mapStateToState, mapDispatchToProps)(DragPane)
