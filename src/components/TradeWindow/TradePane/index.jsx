import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Draggable from 'react-draggable'
import {Layout, Badge , Row, Col, Spin, message} from 'antd';
import Pane from './Pane'
class TradePane extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {visible} = this.props;
        return (
            <Draggable        
                axis="both"
                defaultPosition={{x: 0, y: 0}}
                grid={[5, 5]}
                onStart={()=>{}}
                onDrag={()=>{}}
                onStop={()=>{}}>
                <div style={{display: visible?'block':'none'}}>
                交易窗口
                    <Pane />
                    <Pane />
                </div>
            </Draggable>
        );
    }
}


TradePane.defaultProps = {
    visible: false
};

TradePane.propTypes = {
    visible: PropTypes.bool
};

export default TradePane;
