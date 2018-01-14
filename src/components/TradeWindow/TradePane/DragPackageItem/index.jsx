import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from '../ItemTypes'



const boxSource = {
    beginDrag(props) {
        console.log('drag box!');
        return {
            id: props.data.id,
            value: props.data.value,
            url: props.data.imgUrl
        }
    },

    endDrag(props, monitor) {
        const item = monitor.getItem()
        const dropResult = monitor.getDropResult()
        // 可以在readux中处理 先不这样
        if (dropResult) {
            console.log(`You dropped ${item.id} into ${dropResult.name}!`) // eslint-disable-line no-alert
        }
    },
}

const boxTarget = {
    drop(props, monitor) {
        const source = monitor.getItem();
        props.moveItem(source, props.data);
    }
}




export default function(target){

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
            const { isDragging, connectDragSource, connectDropTarget } = this.props
            const { data, children } = this.props
            return connectDragSource(
                connectDropTarget(
                    <div style={{ opacity: isDragging ? 0.4 : 1 }} key={data.value} className="package-item" data-id={data.value}>
                        {children ? children : <span className="text">{data.value}</span>}
                    </div>)
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

