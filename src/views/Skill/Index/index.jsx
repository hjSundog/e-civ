import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import api from '../../../api';
import { Tabs } from 'antd';
import SkillTabPane from './SkillTabPane'

import * as SkillsActionCreators from '@/actions/skills'

import './index.less'

const TabPane = Tabs.TabPane;

class SkillPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
        }
        api.get('/persons/oier-133ao/skills').then((res) => {
            console.log(res)
            this.props.actions.update_skills(res.data.skills)
        })
    }

    handleTabsChange = () => {

    }

    render() {
        const { skills } = this.props
        return (
            <div className="skill-page">
                <div className="skill-content">
                    <header>
                        <h1>技能总览</h1>
                    </header>
                    <Tabs onChange={this.handleTabsChange} type="card">
                        {/* 考虑 */}
                        <TabPane tab="已学会" key="learned">
                            <SkillTabPane skills={skills}></SkillTabPane>
                        </TabPane>
                        <TabPane tab="战斗" key="battle">
                            <SkillTabPane skills={skills}></SkillTabPane>
                        </TabPane>
                        <TabPane tab="生产" key="produce">
                            <SkillTabPane skills={skills}></SkillTabPane>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        skills: state.skills
    }
}

function mapDispatchToProps (dispatch) {
    return {
        actions: bindActionCreators({
            ...SkillsActionCreators
        },  dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SkillPage)
