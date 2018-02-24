import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragSource, DropTarget } from 'react-dnd'
const boxSource = {
    beginDrag(props) {
        //console.log('drag box!');
        return {
            ...props.data
        }
    },

    endDrag(props, monitor) {
        const item = monitor.getItem()
        const dropResult = monitor.getDropResult()
        // 可以在readux中处理 先不这样
        if (dropResult) {
            console.log(`You dropped ${item.name} into ${dropResult.name}!`)
        }
    },
}

const boxTarget = {
    drop(props, monitor) {
        const source = monitor.getItem();
        props.moveItem(source, props.data);
    }
}




export default (target) => (Wrapper) =>{

    class DumbItem extends Component {
        static propTypes = {
            connectDragSource: PropTypes.func.isRequired,
            isDragging: PropTypes.bool.isRequired,
            data: PropTypes.object.isRequired,
            moveItem: PropTypes.func.isRequired
        }

        static defaultProps = {
            data: {},
            moveItem: ()=>{}
        }

        render() {
            const { connectDragSource, connectDropTarget } = this.props
            return connectDragSource(
                connectDropTarget(
                    <div><Wrapper {...this.props}/></div>)
            )
        }
    }

    return DropTarget(target, boxTarget, (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        sourceClientOffset: monitor.getSourceClientOffset(),
    }))(
        DragSource(target, boxSource, (connect, monitor) => ({
            connectDragSource: connect.dragSource(),
            dragRow: monitor.getItem(),
            clientOffset: monitor.getClientOffset(),
            initialClientOffset: monitor.getInitialClientOffset(),
            isDragging: monitor.isDragging(),
        }))(DumbItem)
    );
}

