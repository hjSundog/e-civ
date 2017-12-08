import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import './index.less'

class Tile extends React.Component {
    constructor (props) {
        super(props)
    }

    render () {
        return (
            <div className={`tile ${this.props.className}`}>
                {
                    this.props.children.map((child) => {
                        return child
                    })
                }
            </div>
        )
    }
}
Tile.propTypes = {
    className: String
}

export default Tile;
