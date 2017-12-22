import React from 'react'
import { Pagination } from 'antd'
import PropTypes from 'prop-types'
import Animate from 'rc-animate';
import SkillCard from './SkillCard'
import SkillDetialModal from './SkillDetailModal'
// import api from '../../api';

import './index.less'


export default class SkillTabPane extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            limit: 10,
            detail: {
                detailVisible: false,
                skill: null,
            },
            nowSkills: props.skills.slice(0,10)
        }
    }

    handlePageChange = (page, pageSize) => {
        this.setState({
            nowSkills: this.props.skills.slice((page-1)*10, page*10)
        })
    }

    handleShowDetail = (skill) => {
        console.log('show');
        this.setState({
            detail: {
                detailVisible: true,
                skill: skill
            }
        })
    }

    render() {
        const { nowSkills, detail } = this.state;
        return (
            <div className="skill-tab-pane">
                <div className="skill-cards">
                    {
                        nowSkills.map((skill, index) => {
                            return <SkillCard key={index} skill={skill} onShowDetail={this.handleShowDetail.bind(null,skill)}></SkillCard>
                        })
                    }
                </div>
                <Animate
                    component=""
                    showProp="visible"
                    transitionAppear
                    transitionName="fade"
                >
                    <SkillDetialModal visible={detail.detailVisible} skill={detail.skill}></SkillDetialModal>
                </Animate>
                <Pagination defaultCurrent={1} total={this.props.skills.length} onChange={this.handlePageChange} />
            </div>
        );
    }
}

SkillTabPane.defaultProps = {
    skills: []
};

SkillTabPane.propTypes = {
    skills: PropTypes.arrayOf(PropTypes.object)
};
