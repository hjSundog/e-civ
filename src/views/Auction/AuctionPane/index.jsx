import React from 'react'
import PropTypes from 'prop-types'
import noop from '@/utils/noop'
import AuctionItem from '../AuctionItem'
import {Pagination, Input} from 'antd'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {add_transaction, cancle_transaction} from '@/actions/websocket'
import './index.less'
const Search = Input.Search;
const PAGESIZE = 8;

class AuctionPane extends React.Component {
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
    // 页码改变
    handlePageChange = (page) => {
        this.setState({
            currentPage: page
        })
    }
    // 删除
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
        const {websocket, actions} = this.props;
        const tData = {
            source: 'person',
            type: 'INVITATION',
            data: {
                from: 'admin',
                to: 'guest',
                payload: {
                    name: 'admin',
                    level: 22
                },
                operation: 'invite',
                message: '来自admin的邀请'
            },
            created_at: new Date().toLocaleDateString()
        };
        console.log('交易啦交易啦');
        // 更改状态
        actions.add_transaction(tData)
        // 发送交易信息
        if (websocket) {
            websocket.send(JSON.stringify(tData))
        } else {
            console.error('没有websocket服务。无法发送交易请求。')
        }
    }

    render () {
        const { datas } = this.props
        const {currentPage} = this.state

        let showDatas = datas.slice((currentPage-1)*PAGESIZE,currentPage*PAGESIZE)

        const html = showDatas.reduce((arr, data) => {
            arr.push(<AuctionItem onDelete={this.handleDelete} onSendMessage={this.handleSendMessage} onTrade={this.handleTrade} key={data.id} data={data} />)
            return arr;
        }, [])
        return (
            <div className='AuctionPane'>
                <Search
                    placeholder="input search text"
                    style={{ width: 300, maxHeight:40, minHeight: 25 }}
                    onSearch={value => console.log(value)}
                    enterButton
                />
                <div>{html}</div>
                <Pagination pageSize={PAGESIZE} current={currentPage} total={datas.length} onChange={this.handlePageChange} hideOnSinglePage/>
            </div>
        )
    }
}

AuctionPane.defaultProps = {
    datas: [],
    add_transaction: noop,
    cancle_transaction: noop,
    onDelete: noop
};

AuctionPane.propTypes = {
    datas: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        level: PropTypes.number,
        avatarUrl: PropTypes.string
    })),
    add_transaction: PropTypes.func,
    cancle_transaction: PropTypes.func,
    onDelete: PropTypes.func
};

function mapStateToProps (state) {
    return {
        user: state.auth.user,
        websocket: state.websocket.ws
    }
}

function mapDispatchToProps (dispatch) {
    return {
        actions: bindActionCreators({
            add_transaction,
            cancle_transaction
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuctionPane);
