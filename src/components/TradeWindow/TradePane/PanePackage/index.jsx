import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Layout, Badge, Spin, message, Row, Col, Slider} from 'antd';
import Iconfont from '@/components/Iconfont'
import ReactGridLayout from 'react-grid-layout'


import './index.less'

class Pane extends Component {
    static propTypes = {
        className: PropTypes.string,
        title: PropTypes.string,
        data: PropTypes.arrayOf(PropTypes.shape({
            imgUrl: PropTypes.string,
            value: PropTypes.number
        })),
        select: PropTypes.func,
        delete: PropTypes.func
    };

    static defaultProps = {
        className: 'PanePackage',
        title: '',
        data: [],
        delete: () => {},
        select: () => {},
        cols: 12,
        onLayoutChange: () => {}
    }

    colCounts = [];

    constructor(props) {
        super(props);
        const layout = this.generateLayout();
        this.state = {
            layout
        };
    }

    generateLayout = () => {
        this.props.data.map((item, i) => {

            const y = 4;
            return {
                x: (i*2)%12,
                y: Math.floor(i / 6) * y,
                w: 2,
                h: y,
                i: i.toString()
            }
        })
    }



    render() {
        const {className, title, data} = this.props;
        return (
            <div className={className}>
                <div className={className+'-head'}>{title}</div>
                <div className={`${className}-body`}>
                    <ReactGridLayout>

                    </ReactGridLayout>
                </div>
                <div className={`${className}-footer`}>价值: 3 Gold</div>
            </div>
        );
    }
}

export default Pane;
