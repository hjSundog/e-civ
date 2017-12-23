import React from 'react'
import PropTypes from 'prop-types'
import Iconfont from '@/components/Iconfont'
import { Button, Progress } from 'antd'
// import api from '../../api';

import './index.less'

export default class SkillDetailModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            skillDetail: null
        }
    }

    componentDidMount() {
        // 更新skillDetail
    }

    componentWillReceiveProps(nextProps) {
        // 第一次
        if(!this.props.skill) {
            return;
        }
        // 关闭modal
        if(!nextProps.skill) {
            return;
        }
        if(this.props.skill.name !== nextProps.skill.name) {
            // 更新skillDetail
        }
    }

    handleClose = () => {
        this.props.onClose()
    }

    render() {
        const { skill, visible } = this.props
        const { skillDetail } = this.state
        const style = {
            display: visible ? 'block' : 'none',
        };
        return (
            <div className="skill-detail-modal" style={style}>
                <header>
                    <h1>技能详情</h1>
                    <Iconfont className="close" type="close" onClick={this.handleClose}></Iconfont>
                </header>
                <section>
                    <div className="skill-title">
                        <h2>{skill && skill.name}</h2>
                    </div>
                    <div className="skill-detail">
                        <p>{skillDetail ? skillDetail : "加载中..."}</p>
                    </div>
                </section>
            </div>
        );
    }
}

SkillDetailModal.defaultProps = {
    onClose: () => {},
};

SkillDetailModal.propTypes = {
    skill: PropTypes.shape({
        id: PropTypes.string
    }),
    onClose: PropTypes.func
};
