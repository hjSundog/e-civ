import React from 'react'
import PropTypes from 'prop-types'
import './index.less'

class Section extends React.Component {
    constructor (props) {
        super(props)
    }
    renderTitle () {
        const title = this.props.title
        if(!title) {
            return null;
        } else if (typeof(title) === 'string') {
            return <h4 className="section-title">{title}</h4>
        } else {
            return title
        }
    }

    renderTip () {
        const tip = this.props.tip
        if(!tip) {
            return null;
        } else if (typeof(tip) === 'string') {
            return <p className="section-tip">{tip}</p>
        } else {
            return tip
        }
    }

    render () {
        return (
            <div className={`section ${this.props.className}`}>
                {this.renderTitle()}
                {this.renderTip()}
            </div>
        )
    }
}
Section.propTypes = {
    className: PropTypes.string,
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]),
    tip: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]),
}

export default Section;
