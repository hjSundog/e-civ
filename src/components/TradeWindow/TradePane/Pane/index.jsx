import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Layout, Badge , Row, Col, Spin, message} from 'antd';
class Pane extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                一个
            </div>
        );
    }
}

export default Pane;
