import React from 'react'
import PropTypes from 'prop-types'
import Iconfont from '@/components/Iconfont'
import { Button, Progress } from 'antd'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as PersonActionCreators from '@/actions/person'

import api from '../../../../../api';

import './index.less'

class SkillTabPane extends React.Component {
    constructor(props) {
        super(props)
    }

    handleClickDetail = () => {
        this.props.onShowDetail()
    }
    handleUse = async () => {
        const { skill, person } = this.props
        const { update_user } = this.props.actions

        const res = await api({
            url: `/skills/${skill.name}/use`,
            method: 'post',
            data: {
            }
        })
        this.props.actions.update_person({
            ...res.data.person
        })
    }
    render() {
        const { skill } = this.props
        return (
            <div className="skill-card">
                <Iconfont type={skill.icon}></Iconfont>
                <Button onClick={this.handleClickDetail}>{skill.display}</Button>
                <Button className="use" disabled={skill.isPassive} onClick={this.handleUse}>{skill.isPassive ? '被动' : '使用'}</Button>
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
    }),
    onShowDetail: PropTypes.func,
};


function mapStateToProps(state) {
    return {
        person: state.person
    }
}

function mapDispatchToProps (dispatch) {
    return {
        actions: bindActionCreators({...PersonActionCreators}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SkillTabPane)
