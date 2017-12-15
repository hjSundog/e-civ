import React from 'react'
import PropTypes from 'prop-types'
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

Tile.defaultProps = {
    className: ''
};

Tile.propTypes = {
    className: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.object)
};


export default Tile;
