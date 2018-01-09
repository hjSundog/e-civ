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


const data = [
    {
        imgUrl: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        value: 30
    },
    {
        imgUrl: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        value: 10
    },
    {
        imgUrl: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        value: 20
    },
    {
        imgUrl: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        value: 90
    }
]

const ResponsiveReactGridLayout = ReactGridLayout.Responsive;

class TradePane extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    handleCloseClick = () => {
        this.props.onClose();
    }


    handlePackageSelect = () => {

    }


    handlePackageDelete = () => {

    }


    render() {
        const {visible} = this.props;
        // const layouts = [
        //     {
        //         i: 'my',
        //         x: 0,
        //         y: 0,
        //         w: 4,
        //         h: 4
        //     },{
        //         i: 'other',
        //         x: 0,
        //         y: 4,
        //         w: 4,
        //         h: 4,
        //     },{
        //         i: 'package',
        //         x: 8,
        //         y: 0,
        //         w: 4,
        //         h: 3
        //     }
        // ]

        return (
            <Rnd
                default={{
                    x: 0,
                    y: 0,
                }}
                maxHeight = {700}
                maxWidth = {1200}
                minWidth = {600}
                minHeight = {200}
                dragGrid = {[5, 5]}
                resizeGrid = {[5, 5]}
                onResize={()=> {}}
                onDragStop={()=> {}}
                onResizeStart={()=> {}}
                onResizeStop={()=> {}}
                cancel=".Panes"
            >
                <div className="TradePane" style={{display: visible?'flex':'none'}}>
                    <div className="PaneHead">交易窗口<span onClick={this.handleCloseClick}><Iconfont type="close"></Iconfont></span></div>
                    {/* <ResponsiveReactGridLayout autoSize={true} onDrag={this.handleInnerDrag}  width={1500} verticalCompaact={false} compactType={"horizontal"} className="Panes" layouts={layouts} cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}} breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}>
                        <div key="my"><Pane /></div>
                        <div key="other"><Pane /></div>
                        <div key="package">背包</div>
                    </ResponsiveReactGridLayout> */}
                    <div className="Panes">
                        <div className="paneContainer">
                            <div className="paneWrapper">
                                <Pane key="my"/>
                                <Pane key="other"/>
                            </div>
                            <div className="PaneOp">
                                <Button type="primary">确认交易</Button>
                                <Button type="primary">取消交易</Button>
                            </div>
                        </div>
                        <PanePackage className="PanePackage" title="背包" data={data} delete={this.handlePackageDelete} select={this.handlePackageSelect}/>
                    </div>
                </div>
            </Rnd>
        );
    }
}


TradePane.defaultProps = {
    visible: false,
    onClose: () => {}
};

TradePane.propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func
};

export default TradePane;
