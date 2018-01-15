import React, { Component } from 'react';
import PropTypes from 'prop-types'

class Item extends Component{

    static propTypes = {
        data: PropTypes.object.isRequired,
        moveItem: PropTypes.func
    };

    static defaultProps = {
        data: {},
    }


    constructor(props) {
        super(props);
    }

    render () {
        const {children, data, isDragging, isOver} = this.props;
        return (
            <div style={{ opacity: isDragging ? 0.4 : 1 ,transform: isOver? 'scale(.95)': 'scale(1)'}} key={data.value} className="package-item" data-id={data.value}>
                {children ? children : <span className="text">{data.value}</span>}
            </div>
        )
    }
}

export default Item
