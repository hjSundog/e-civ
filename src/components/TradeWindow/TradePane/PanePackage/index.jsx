import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Layout, Badge, Spin, message, Row, Col, Slider} from 'antd';
import Iconfont from '@/components/Iconfont'
import ReactGridLayout from 'react-grid-layout'
import '@/../node_modules/react-grid-layout/css/styles.css'
import '@/../node_modules/react-resizable/css/styles.css'

import './index.less'
const WithProvider = ReactGridLayout.WidthProvider;
const ResponsiveReactGridLayout = ReactGridLayout.Responsive
class Pane extends Component {
    static propTypes = {
        className: PropTypes.string,
        title: PropTypes.string,
        data: PropTypes.arrayOf(PropTypes.shape({
            imgUrl: PropTypes.string,
            value: PropTypes.number
        })),
        select: PropTypes.func,
        delete: PropTypes.func,
        width: PropTypes.number,
        breakpoints: PropTypes.objectOf(PropTypes.shape({
            lg: PropTypes.string,
            md: PropTypes.string,
            sm: PropTypes.string,
            xs: PropTypes.string,
            xxs: PropTypes.string,       
        })),
        rowHeight: PropTypes.number,
        cols: PropTypes.objectOf(PropTypes.shape({
            lg: PropTypes.number,
            md: PropTypes.number,
            sm: PropTypes.number,
            xs: PropTypes.number,
            xxs: PropTypes.number,       
        })),
        compactType: PropTypes.string,
    };

    static defaultProps = {
        // className: 'PanePackage',
        title: '',
        data: [],
        width: 360,
        delete: () => {},
        select: () => {},
        breakpoints: {lg: 900, md: 800, sm: 640, xs: 480, xxs: 0},
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
            layouts: this.generateLayouts(this.props.cols)
        };
        console.log(this.state.layouts);
    }
    onLayoutChange = (layout) => {
        console.log('layout change')
        // this.props.onLayoutChange(layout);
    }

    generateLayouts = (cols) => {
        return Object.entries(cols).reduce((cols, newCol) => {
            cols[newCol[0]] = this.generateLayout(newCol[1]);
            return cols;
        }, {})
    }

    generateLayout = (col) => {
        const {data} = this.props;
        return data.map((item, i) => {
            return {
                i: i.toString(),
                x: i%col,
                y: 4*Math.floor(i/col),
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

    handleWidthChange =  (cw, margin, cols, cp) => {
        console.log(`width changed: ${cw}`)
    }
    generateDOM() {
        return this.state.layouts[this.state.currentBreakpoint].map(function(l, i) {
            return (
                <div key={i} className="package-item" data-id={i}>
                    <span className="text">{i}</span>
                </div>
            );
        });
    }

    onBreakpointChange = breakpoint => {
        this.setState({
            currentBreakpoint: breakpoint
        });
    };

    render() {
        const {className, title, width} = this.props;
        console.log('width is'+this.props.width)
        return (
            <div className={className +' GridPane'}>
                <div className={className+'-head head'}>{title}</div>
                <div className={`${className}-body body`} onClick={this.handleItemFocus} onDoubleClick={this.handleItemSelect}>
                Current Breakpoint: {this.state.currentBreakpoint} ({
                        this.props.cols[this.state.currentBreakpoint]
                    }{" "}
          columns)
                    <ResponsiveReactGridLayout  
                        onBreakpointChange={this.onBreakpointChange}
                        onLayoutChange={this.onLayoutChange} 
                        onWidthChange={this.handleWidthChange} 
                        width={width} 
                        {...this.props}
                        layouts={this.state.layouts}>
                        {this.generateDOM()}
                    </ResponsiveReactGridLayout>
                </div>
                <div className={`${className}-footer foot`}>价值: 3 Gold</div>
            </div>
        );
    }
}

export default Pane;
