import React from 'react'
import PropTypes from 'prop-types'
import Iconfont from '@/components/Iconfont'
import { Button, Progress } from 'antd'
// import api from '../../api';

import './index.less'

export default class SkillDetailModal extends React.Component {
    constructor(props) {
        super(props)
    }

    componentWillReceiveProps(nextProps) {
        // if(nextProps.visible)
    }

    render() {
        const { skill, visible } = this.props
        const style = {
            display: visible ? 'block' : 'none',
        };
        return (
            <div className="skill-detail-modal" style={style}>
                keke
            </div>
        );
    }
}

SkillDetailModal.propTypes = {
    skill: PropTypes.shape({
        id: PropTypes.string
    })
};
