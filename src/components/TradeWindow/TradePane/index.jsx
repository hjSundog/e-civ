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
// test data
// const packageItems = [
//     {
//         id: 1,
//         imgUrl: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
//         value: 30
//     },
//     {
//         id: 2,
//         imgUrl: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
//         value: 10
//     },
//     {
//         id: 3,
//         imgUrl: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
//         value: 20
//     },
//     {
//         id: 4,
//         imgUrl: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
//         value: 90
//     }
// ]

const ResponsiveReactGridLayout = ReactGridLayout.Responsive;

class TradePane extends Component {
    static propTypes = {
        className: PropTypes.string,
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

    render() {
        const {visible, items} = this.props;
        const packageItems = items.packageItems.map((item) => {
            return {
                ...item.item
            }
        })
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
                                    <Pane title="自己的交易窗口" source={ItemTypes.DragItem} data={items.fromItems} key="my"/>
                                    <Pane title="别人的交易窗口" source={ItemTypes.DragItemSelf} data={items.toItems} key="other" />
                                </div>
                                <div className="PaneOp">
                                    <Button type="primary">确认交易</Button>
                                    <Button type="primary">取消交易</Button>
                                </div>
                            </div>
                            <PanePackage width={this.state.width*1/3} className="PanePackage" title="背包" data={packageItems} delete={this.handlePackageDelete} select={this.handlePackageSelect}/>
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
    }
};

TradePane.propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
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

function mapStateToProps (state) {
    return {
        items: state.items
    }
}

export default connect(mapStateToProps)(TradePane);
