import React, { Component } from 'react';
import PropTypes, { func } from 'prop-types'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Layout, Badge, Spin, message, Row, Col, Slider, Pagination } from 'antd';
import Iconfont from '@/components/Iconfont'
import ReactGridLayout from 'react-grid-layout'
import '@/../node_modules/react-grid-layout/css/styles.css'
import '@/../node_modules/react-resizable/css/styles.css'
import './index.less'
import * as ItemsActionCreators from '@/actions/items'
import ItemTypes from '../ItemTypes'
import DragItem from '../DragItem'
import Item, {PackageItem} from '../Item'
const ItemType = ItemTypes.DragItem

const DragPackageItem = DragItem(ItemType)(PackageItem)

// const WithProvider = ReactGridLayout.WidthProvider;
const ResponsiveReactGridLayout = ReactGridLayout.Responsive
class Pane extends Component {
    static propTypes = {
        className: PropTypes.string,
        title: PropTypes.string,
        data: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
            vendor_value: PropTypes.number
        })),
        select: PropTypes.func,
        delete: PropTypes.func,
        width: PropTypes.number,
        breakpoints: PropTypes.shape({
            lg: PropTypes.number,
            md: PropTypes.number,
            sm: PropTypes.number,
            xs: PropTypes.number,
            xxs: PropTypes.number,
        }),
        rowHeight: PropTypes.number,
        cols: PropTypes.shape({
            lg: PropTypes.number,
            md: PropTypes.number,
            sm: PropTypes.number,
            xs: PropTypes.number,
            xxs: PropTypes.number,
        }),
        compactType: PropTypes.string,
    };

    static defaultProps = {
        // className: 'PanePackage',
        title: '',
        data: [],
        width: 260,
        delete: () => { },
        select: () => { },
        breakpoints: { lg: 900, md: 800, sm: 640, xs: 480, xxs: 0 },
        className: "layout",
        rowHeight: 40,  // 只是一个基准值而非固定值，h为3时实际为3*40 = 120mdzz
        cols: { lg: 7, md: 6, sm: 5, xs: 4, xxs: 3 },
        compactType: "horizontal",

    }

    colCounts = [];

    constructor(props) {
        super(props);
        this.state = {
            currentBreakpoint: "xxs",
            mounted: false,
            layouts: this.generateLayouts(this.props.cols, this.props.data)
        };
        // console.log(this.state.layouts);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.data !== nextProps.data) {
            this.setState({
                layouts: this.generateLayouts(this.props.cols, nextProps.data)
            })
        }
    }

    onLayoutChange = (layout) => {
        console.log('layout change');
        // this.props.onLayoutChange(layout);
    }

    moveItem = () => {
        //console.log('move item');
    }

    generateLayouts = (cols, data) => {
        const self = this;
        return Object.entries(cols).reduce((cols, newCol) => {
            cols[newCol[0]] = self.generateLayout(newCol[1], data);
            return cols;
        }, {})
    }

    generateLayout = (col, data) => {
        return data.map((item, i) => {
            return {
                i: i.toString(),
                x: i % col,
                y: 4 * Math.floor(i / col),
                w: 1,
                h: 1,
                isDraggable: true,
                isResizable: false,
            }
        })
    }

    handleItemFocus = () => {

    }

    handleItemSelect = () => {

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

    handleWidthChange = (cw, margin, cols, cp) => {
        console.log(`width changed: ${cw}`)
    }
    generateDOM = () => {
        const { data } = this.props
        const self = this;
        return this.state.layouts[this.state.currentBreakpoint].map(function (l, i) {
            return (
                <div key={i}>
                    <DragPackageItem addItem={self.addItem}  moveItem={self.moveItem} data={data[i]}>
                    </DragPackageItem>
                </div>
            );
        });
    }

    onChangePage = (pageNum) => {
        console.log('Page: ', pageNum);
    }

    onBreakpointChange = breakpoint => {
        this.setState({
            currentBreakpoint: breakpoint
        });
    };

    handleItemDragStop = (layout, oldItem, newItem, placeholder, e,  ele) => {
        //console.log('drag stop');
    }

    // handleItemDragStart = (layout, oldItem, newItem, placeholder, e,  ele) => {
    //     ele.addEventListener('mouseup', function(e) {
    //         console.log('mouse up');
    //     })
    // }

    handleItemDrag = (layout, oldItem, newItem, placeholder, e,  ele)  => {
        // 为什么我松开鼠标还是出于拖拽状态？？ 要死要死要死fffffffffffffffffffffffffffffuuuuuuuuuuuuuuuucccccccccccccccccckkkkkkkkkkkkk
        // ele.getAttribute('mouseup')?console.log('hh'):ele.addEventListener('mouseup', function(e) {
        //     console.log('mouse up');
        // })
        //console.log(e.type === 'mousemove'?'drag now':e.type);
    }

    render() {
        const { className, title, width } = this.props;
        // console.log('width is' + this.props.width)
        return (
            <div className={className + ' GridPane'}>
                <div className={className + '-head head'}>{title}</div>
                <div className={`${className}-body body`} onClick={this.handleItemFocus} onDoubleClick={this.handleItemSelect}>
                    Current Breakpoint: {this.state.currentBreakpoint} ({
                        this.props.cols[this.state.currentBreakpoint]
                    }{" "}
                    columns)
                    <ResponsiveReactGridLayout
                        onBreakpointChange={this.onBreakpointChange}
                        onLayoutChange={this.onLayoutChange}
                        onWidthChange={this.handleWidthChange}
                        onDragStop = {this.handleItemDragStop}
                        useCSSTransforms={this.state.mounted}
                        preventCollision={false}
                        measureBeforeMount={false}
                        onDrag = {this.handleItemDrag}
                        onDragStart = {this.handleItemDragStart}
                        width={width}
                        {...this.props}
                        layouts={this.state.layouts}>
                        {this.generateDOM()}
                    </ResponsiveReactGridLayout>
                </div>
                <div className={`${className}-footer foot`}>价值: 3 Gold</div>
                <Pagination showQuickJumper defaultCurrent={1} hideOnSinglePage total={this.props.data.length} onChange={this.onChangePage} />,
            </div>
        );
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

export default connect(mapStateToState, mapDispatchToProps)(Pane)
