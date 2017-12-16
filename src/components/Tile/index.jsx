import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './index.less'

class Tile extends React.Component {
    constructor (props) {
        super(props)
    }

    render () {
        const { color, backgroundColor } = this.props
        const tileClassNames = classNames({
            'tile': true,
            'tile-double': this.props.double,
            [`tile-${this.props.contentPosition}`]:true
        })
        return (
            <div className={tileClassNames}
                style={{
                    color: color,
                    backgroundColor: backgroundColor
                }}>
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
    className: '',
    double: false,
    contentPosition: 'center',
    backgroundColor: '#525252',
    color: '#fff',
};

Tile.propTypes = {
    className: PropTypes.string,
    double: PropTypes.bool,
    children: PropTypes.arrayOf(PropTypes.object),
    contentPosition: PropTypes.oneOf([
        'center',
        'left-top',
        'right-top',
        'left-bottom',
        'right-bottom'
    ]),
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
};


export default Tile;
