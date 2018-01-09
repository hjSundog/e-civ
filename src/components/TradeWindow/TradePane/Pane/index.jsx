import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Layout, Badge, Spin, message, Row, Col, Slider} from 'antd';
import Iconfont from '@/components/Iconfont'


import './index.less'

class Pane extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    colCounts = [];

    constructor(props) {
        super(props);
        this.state = {
            colCountKey: 0,
        };
        [1, 2, 3, 4].forEach((value, i) => { this.colCounts[i] = value; });
    }

    onColCountChange = () => {
        const colCountKey = (this.state.colCountKey+1) % this.colCounts.length;
        this.setState({ colCountKey });
    }

    render() {
        const { colCountKey } = this.state;
        const rows = [];
        let cols = [];
        const data = Array.from(Array(8), (v,k) => {
            return k;
        });
        const colCount = this.colCounts[colCountKey];
        let colCode = '';
        for(let i = 0; i < Math.ceil(data.length/colCount); i++) {
            cols = [];
            for (let j = 0; j < colCount; j++) {
                cols.push(
                    <Col key={j.toString()} span={24 / colCount}>
                        <div className="paneItem">
                            <img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3880507419,2968712832&fm=27&gp=0.jpg"/>
                            <span>{data[i*colCount+j]}</span>
                        </div>
                    </Col>
                );
                colCode += `  <Col span={${24 / colCount}} />\n`;
            }
            rows.push(
                <Row key={'row-'+i}>{cols}</Row>
            )
        }


        const {paneName = ''} = this.props;

        return (
            <div className="TradeOfPane">
                <div style={{ padding: 10 }}>
                    <div className="header"><Iconfont type="clickable" onClick={this.onColCountChange}></Iconfont><span className="paneName">{'自己的交易窗口'}</span></div>
                </div>
                <div className="trade-item-container">{rows}</div>
                <div className="trade-item-extra">
                    <div>额外加价：100 Gold</div>
                    <div>价值估算：210 Gold</div>
                </div>
            </div>
        );
    }
}

export default Pane;
