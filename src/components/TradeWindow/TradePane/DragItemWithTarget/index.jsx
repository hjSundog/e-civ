import DumbItem from '../DragPackageItem'
import React, { Component } from 'react';
import PropTypes from 'prop-types'

class DragItemWithTarget extends Component{

    static propTypes = {
        target: PropTypes.string.isRequired
    };

    static defaultProps = {
        target: 'item'
    }


    constructor(props) {
        super(props);
    }
    
    render () {
        const {target, ...rest} = this.props;
        const DragPackageItem = DumbItem(target)
        return (
            <DragPackageItem {...rest}/>
        )
    }
}

export default DragItemWithTarget