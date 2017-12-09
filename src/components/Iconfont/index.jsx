import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import './iconfont.less'

const prefix = 'icon'

class Iconfont extends React.Component {
    constructor (props) {
        super(props)
    }

    render () {
        return (
            <svg className={prefix}
                aria-hidden="true"
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}
                onFocus={this.props.onFocus}
                onClick={this.props.onClick}
            >
                <use xlinkHref={`#${prefix}-${this.props.type}`} />
            </svg>
        )
    }
}
Iconfont.propTypes = {
    type: PropTypes.string.isRequired,
}

export default Iconfont;
