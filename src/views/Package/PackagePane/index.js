import React from 'react';
import PropTypes from 'prop-types'
import './index.less'
import api from '../../../api'
import { Button, message, Tabs, Row, Col, Card, Avatar } from 'antd'

const TabPane = Tabs.TabPane;


class PackagePane extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            building:{},
            visible: false
        }
    }


    render() {
        return (
            <div>
                背包格子。。
            </div>
        );
    }
}

PackagePane.defaultProps = {
}

PackagePane.propTypes = {

}

export default PackagePane;
