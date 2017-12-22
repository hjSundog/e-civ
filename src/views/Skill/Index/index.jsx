import React from 'react'
// import api from '../../api';
import { Tabs } from 'antd';
import SkillTabPane from './SkillTabPane'

import './index.less'

const TabPane = Tabs.TabPane;

export default class MailboxPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // 全部技能信息
            skills: [{
                name: 'walk'
            },{
                name: 'walk'
            },{
                name: 'walk'
            },{
                name: 'walk'
            },{
                name: 'walk'
            },{
                name: 'walk'
            },{
                name: 'walk'
            },{
                name: 'walk'
            },{
                name: 'walk'
            },{
                name: 'walk'
            },{
                name: 'walk'
            },{
                name: 'walk'
            },{
                name: 'walk'
            },{
                name: 'walk'
            },{
                name: 'walk'
            },{
                name: 'walk'
            },{
                name: 'walk'
            },{
                name: 'walk'
            },{
                name: 'walk'
            },{
                name: 'walk'
            },]
        }
    }

    handleTabsChange = () => {

    }

    render() {
        const { skills } = this.state
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
