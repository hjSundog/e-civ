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
        const {data, isDragging, isOver} = this.props;
        return (
            <div  className="paneItem" style={{ opacity: isDragging ? 0.4 : 1 ,transform: isOver? 'scale(.95)': 'scale(1)'}} key={data.name} className="package-item" data-id={data.name}>
                <div>
                    <img src= {data.icon || "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3880507419,2968712832&fm=27&gp=0.jpg"} />
                    <span>{data['name']}</span>
                </div>            
            </div>
        )
    }
}

export default Item
