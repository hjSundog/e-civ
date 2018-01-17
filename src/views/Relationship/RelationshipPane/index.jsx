import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import noop from '@/utils/noop'
import ReItem from '../ReItem'
import Animate from 'rc-animate';
import {Pagination} from 'antd'
const PAGESIZE = 8;

class RelationPane extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            loading: false,
            currentPage: 1
        }
    }

    componentWillMount() {

    }

    componentWillReceiveProps(props) {
        this.setState({
            datas: props.datas
        })
    }

    handlePageChange = (page) => {
        this.setState({
            currentPage: page
        })
    }

    handleDelete = (target) => {
        const { type, datas } = this.props;

        let ndx = datas.findIndex((data) => {
            return data.id === target.id
        })

        this.props.onDelete(ndx, type);
    }

    handleSendMessage = () => {

    }

    handleTrade = () => {

    }

    render () {
        const { datas } = this.props
        const {currentPage} = this.state

        let showDatas = datas.slice((currentPage-1)*PAGESIZE,currentPage*PAGESIZE)

        const html = showDatas.reduce((arr, data) => {
            arr.push(<ReItem onDelete={this.handleDelete} onSendMessage={this.handleSendMessage} onTrade={this.handleTrade} key={data.id} data={data} />)
            return arr;
        }, [])
        return (
            <div className='RelationPane'>
                <div className="search">搜索框</div>
                <div>{html}</div>
                <Pagination pageSize={PAGESIZE} current={currentPage} total={datas.length} onChange={this.handlePageChange} hideOnSinglePage/>
            </div>
        )
    }
}

RelationPane.defaultProps = {
    datas: [],
    onDelete: noop
};

RelationPane.propTypes = {
    datas: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        level: PropTypes.number,
        avatarUrl: PropTypes.string
    })),
    onDelete: PropTypes.func
};


export default RelationPane;
