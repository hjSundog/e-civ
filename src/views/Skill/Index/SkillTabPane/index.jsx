import React from 'react'
import PropTypes from 'prop-types'
import SkillCard from './SkillCard'
// import api from '../../api';

import './index.less'

export default class SkillTabPane extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            limit: 20,
        }
    }

    render() {
        const skill = {
            name: 'walk'
        }
        return (
            <div className="skill-tab-pane">
                <SkillCard skill={skill}></SkillCard>
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
