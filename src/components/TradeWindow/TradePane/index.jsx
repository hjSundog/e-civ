import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Draggable from 'react-draggable'
import Rnd from 'react-rnd'
import ReactGridLayout from 'react-grid-layout'
import {Layout, Badge , Row, Col, Spin, message, Button} from 'antd';
import Pane from './Pane'
import PanePackage from './PanePackage'
import Iconfont from '@/components/Iconfont'
import './index.less'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import ItemTypes from './ItemTypes'
import {empty_to_item, empty_from_item} from '@/actions/items'
const ResponsiveReactGridLayout = ReactGridLayout.Responsive;

class TradePane extends Component {
    static propTypes = {
        className: PropTypes.string,
        visible: PropTypes.bool,
        onClose: PropTypes.func,
        websocket: PropTypes.object.isRequired,
        tradingWith:PropTypes.shape({
            data: PropTypes.shape({
                from: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                to: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                payload: PropTypes.shape({
                    name: PropTypes.string,
                    level: PropTypes.number
                })
            })
        }),
        items: PropTypes.shape({
            fromItems: PropTypes.shape({
                payload: PropTypes.array,
                extra: PropTypes.array
            }),
            toItems: PropTypes.shape({
                payload: PropTypes.array,
                extra: PropTypes.array
            }),
            packageItems: PropTypes.array
        }).isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            width: 600,
            height: 500,
            x: 0,
            y: 0
        };

    }

    // componentWillReceiveProps(nextProps) {
    //     if (this.props.tradingWith.from !== nextProps.tradingWith.from) {
    //         this.setState({
    //             tradingWith: nextProps.tradingWith
    //         })
    //     }
    // }

    shouldComponentUpdate(nextProps) {
        if (this.props.tradingWith.from !== nextProps.tradingWith.from || this.props.visible !== nextProps.visible || this.props.items !== nextProps.items) {
            //console.log('origin: '+this.props.visible+':next: '+nextProps.visible)
            return true
        }


        return false
    }

    handleCloseClick = () => {
        this.props.onClose();
    }


    handlePackageSelect = () => {

    }


    handlePackageDelete = () => {

    }


    handleResizeStart = (e, dir, ref, delta, position) => {

    }

    handleResize =  (e, dir, ref, delta, position) => {
        if(dir === 'right' || dir === 'left'){
            this.setState({
                width: ref.offsetWidth,
                height: ref.offsetHeight,
                ...position,
            });
        }
        return;
    }

    handleResizeStop = (e, dir, ref, delta, position) => {

    }

    // 处理交易,敲板决定交易数据了，tradeWindow 的确认交易按钮
    handleTradeReceive = () => {
        console.log('receive trade')
        const {websocket, tradingWith, items} = this.props;
        const from = tradingWith.from;
        const to = tradingWith.to;
        // 有回调就好了。。这里理想的认为都可达
        websocket.send(JSON.stringify({
            source: 'person',
            type: 'INVITATION',
            data: {
                from: from,
                to: to,
                message: '我们开始了一场交fa易',
                operation: 'confirm',
                items: [...items.fromItems.payload],
                extra: [...items.fromItems.extra]
            }
        }))
    }

    // 取消这次交易
    handleTradeCancle = () => {
        const {websocket, tradingWith, actions} = this.props;
        const from = tradingWith.from;
        const to = tradingWith.to;
        console.log('cancle the trade')
        // 重置fromItems 和 toItems
        this.handleCloseClick();
        actions.empty_to_item();
        actions.empty_from_item();
        websocket.send(JSON.stringify({
            source: 'person',
            type: 'INVITATION',
            data: {
                from: from,
                to: to,
                message: '我拒绝了你喔',
                operation: 'refuse'
            }
        }))
    }

    render() {
        //console.log('tradingWith: '+this.props.tradingWith)
        const {visible, items} = this.props;
        const self = this;
        const packageItems = items.packageItems;
        // const packageItems = items.packageItems.map((item) => {
        //     return {
        //         ...item.item
        //     }
        // })
        //console.log('state width is:' + this.state.width);
        return (
            <DragDropContextProvider backend={HTML5Backend}>
                <Rnd
                    default={{
                        x: 0,
                        y: 0,
                    }}
                    maxHeight = {700}
                    maxWidth = {1200}
                    minWidth = {800}
                    minHeight = {200}
                    dragGrid = {[5, 5]}
                    resizeGrid = {[5, 5]}
                    onDragStop={()=> {}}
                    onResizeStart={this.handleResizeStart}
                    onResize = {this.handleResize}
                    onResizeStop={this.handleResizeStop}
                    cancel=".Panes"
                >
                    <div className="TradePane" style={{display: visible?'flex':'none'}}>
                        <div className="PaneHead">交易窗口<span onClick={this.handleCloseClick}><Iconfont type="close"></Iconfont></span></div>
                        <div className="Panes">
                            <div className="paneContainer">
                                <div className="paneWrapper">
                                    <Pane title="自己的交易窗口" 
                                        source={ItemTypes.DragItem} 
                                        data={items.fromItems} key="my"
                                    />
                                    <Pane title="别人的交易窗口" 
                                        source={ItemTypes.SideItem} 
                                        data={items.toItems} key="other" 
                                    />
                                </div>
                                <div className="PaneOp">
                                    <Button type="primary" onClick={self.handleTradeReceive}>确认交易</Button>
                                    <Button type="primary" onClick={self.handleTradeCancle}>取消交易</Button>
                                </div>
                            </div>
                            <PanePackage 
                                width={this.state.width*1/3} 
                                className="PanePackage" 
                                title="背包" 
                                data={packageItems} 
                                delete={this.handlePackageDelete} 
                                select={this.handlePackageSelect}
                            />
                        </div>
                    </div>
                </Rnd>
            </DragDropContextProvider>
        );
    }
}


TradePane.defaultProps = {
    visible: false,
    onClose: () => {},
    websocket: {},
    items: {
        fromItems: {
            payload: [],
            extra: []
        },
        toItems: {
            payload: [],
            extra: []
        },
        packageItems: []
    },
    tradingWith: {
        from: '',
        to: ''
    }
};

function mapDispatchToState(dispatch) {
    return {
        actions: bindActionCreators({empty_to_item, empty_from_item}, dispatch)
    }
}

export default connect(null, mapDispatchToState)(TradePane);
