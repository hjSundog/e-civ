import React from 'react'
// import api from '../../api';
import { Tabs } from 'antd';
import SkillTabPane from './SkillTabPane'

import './index.less'

const TabPane = Tabs.TabPane;

class SkillPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // 全部技能信息
            skills: [{
                name: 'cultivate',
                desc: '春种一粒粟，秋收万颗子。',
                icon: 'skill-cultivate',
                display: '种植',

                type: 'life',
                isPassive: false,
                facts: [{
                    text: '体力下降',
                    type: 'AttributeAdjust',
                    value: 20,
                    target: 'health'
                }]
            }]
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

export default SkillPage
