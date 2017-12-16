import React from 'react'
import PropTypes from 'prop-types'
import Iconfont from '@/components/Iconfont'
import { Button, Progress } from 'antd'
// import api from '../../api';

import './index.less'

export default class SkillTabPane extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { skill } = this.props
        return (
            <div className="skill-card">
                <Iconfont type={`skill-${skill.name}`}></Iconfont>
                <Button>徒步旅行</Button>
                <Button className="use" disabled={true}>被动</Button>
                <div className="skill-proficiency">
                    <span>level: 3</span>
                    <Progress percent={40.3}></Progress>
                </div>
            </div>
        );
    }
}

SkillTabPane.propTypes = {
    skill: PropTypes.shape({
        id: PropTypes.string
    })
};
