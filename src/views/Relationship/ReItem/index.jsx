import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import noop from '@/utils/noop'
import {Avatar, Button} from 'antd'

const verticalAlign = {
    display: 'flex',
    alignItems: 'center',
}

class ReItem extends React.Component {
    constructor (props) {
        super(props)
    }

    handleDelete = () => {
        this.props.onDelete(this.props.data);
    }

    handleSendMessage = () => {
        this.props.onSendMessage(this.props.data);
    }

    handleTrade = () => {
        this.props.onTrade(this.props.data);
    }

    handleCheck= () => {
        this.props.onCheck(this.props.data);
    }

    render () {
        const { data} = this.props
        return (
            <div className='ReItem' style={{...verticalAlign,justifyContent: 'space-between'}}>
                <div style={{...verticalAlign, minWidth: '150px',justifyContent: 'space-around'}}>
                    <Avatar src={data.avatarUrl} style={{margin: '4px 10px 4px 5px'}}>{data.avatarUrl?null:'U'}</Avatar>
                    <span style={{marginRight: '10px'}}>{data.name}</span>
                    <span style={{marginRight: '10px'}}>{data.level}</span>
                </div>
                <div style={{flexGrow: 1,display: 'flex',justifyContent: 'space-around', maxWidth: '450px'}}>
                    <Button type="primary" onClick={this.handleSendMessage}>通信</Button>
                    <Button type="primary" onClick={this.handleTrade}>交易</Button>
                    <Button type="primary" onClick={this.handleCheck}>查看</Button>
                    <Button type="danger" onClick={this.handleDelete}>删除</Button>
                </div>
            </div>
        )
    }
}

ReItem.defaultProps = {
    data: {
        name: 'db',
        level: 100,
        avatarUrl: ''
    },
    onTrade: noop,
    onDelete: noop,
    onSendMessage: noop,
    onCheck: noop
};

ReItem.propTypes = {
    data: PropTypes.shape({
        name: PropTypes.string,
        level: PropTypes.number,
        avatarUrl: PropTypes.string,
    }),
    onTrade: PropTypes.func,
    onDelete: PropTypes.func,
    onSendMessage: PropTypes.func,
    onCheck: PropTypes.func
};


export default ReItem;
