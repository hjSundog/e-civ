import React from 'react'
import { Row, Col, Card, message, Tabs, Spin, Input } from 'antd';
import api from '../../api'
import './index.less'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RelationshipPane from './RelationshipPane'
import SearchPane from './SearchPane'
const TabPane = Tabs.TabPane
const Search = Input.Search;
class Relationship extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            relationship: {}
        }
    }

    // componentWillReceiveProps(props) {

    // }

    componentWillMount() {
        // this.setState({
        //     loading: true,
        // })

        const prifixs = ['mdzz', 'fuck', 'doubi']
        const total = Array.from({ length: 10 }, (v, k) => {
            return {
                name: prifixs[Math.floor(Math.random() * prifixs.length)] + ':' + k,
                id: k,
                avatarUrl: '',
                level: Math.floor(Math.random() * 50)
            }
        })
        total.unshift({
            name: 'guest',
            id: 'key',
            avatarUrl: '',
            level: 999
        })
        this.setState({
            relationship: {
                total: total,
                friends: total.slice(0, 5),
                strangers: total.slice(5, 7),
                latests: total.slice(7, 9),
                blacklists: total.slice(9)
            }
        })

        //获取好友列表
        // api({
        //     method: 'get',
        //     url: '/persons/1/friends',
        // }).then(res => {
        //     this.setState({
        //         loading: false
        //     })
        //     if (res.status === 200){
        //         //console.log(res.data)
        //         this.setState({
        //             relationship: res.data
        //         })
        //     } else {
        //         console.log(res.message)
        //     }
        // }).catch(error => {
        //     message.error(error)
        //     this.setState({
        //         loading: false
        //     })
        // })
    }


    handleDelete = (target, type) => {
        type = type.toLowerCase()
        const temp = [...this.state.relationship[type]];
        temp.splice(target, 1);

        this.setState({
            relationship: {
                ...this.state.relationship,
                [type]: temp
            }
        })
    }

    handleSearch = (value) => {
        const {websocket, user} = this.props;
        const tData = {
            source: 'person',
            type: 'INVITATION',
            data: {
                from: user.name,
                to: value,
                operation: 'search',
            }
        }
        // 发送交易信息
        if (websocket) {
            websocket.send(JSON.stringify(tData))
        } else {
            console.error('没有websocket服务。无法发送交易请求。')
        }
    }

    render() {
        const { relationship } = this.state
        const {user} = this.props;
        let flag = false;
        if (user.search && user.search.length>0) {
            flag = true;
        }
        return (
            <div className="relationship">
                <Search
                    placeholder="input search text"
                    style={{ width: 300, maxHeight: 40, minHeight: 25, position: 'absolute', right: 20, top: 10 }}
                    onSearch={this.handleSearch}
                    enterButton
                />
                {flag
                    ?<SearchPane type="SERACH" datas={user.search}/>
                    :<Spin spinning={this.state.loading}>
                        <Tabs tabPosition={'top'}>
                            <TabPane tab="好友" key="2"><RelationshipPane type="FRIENDS" onDelete={this.handleDelete} datas={relationship.friends} /></TabPane>
                            <TabPane tab="最近" key="3"><RelationshipPane type="LATEST" onDelete={this.handleDelete} datas={relationship.latest} /></TabPane>
                            <TabPane tab="陌生" key="4"><RelationshipPane type="STRANGERS" onDelete={this.handleDelete} datas={relationship.strangers} /></TabPane>
                            <TabPane tab="黑名单" key="5"><RelationshipPane type="BLACKLISTS" onDelete={this.handleDelete} datas={relationship.blacklists} /></TabPane>
                        </Tabs>
                    </Spin>}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        person: state.person,
        websocket: state.websocket.ws
    }
}

// function mapDispatchToProps(dispatch) {
//     return {
//         actions: bindActionCreators(PersonActionCreators,dispatch)
//     }
// }

// export default Relationship
export default connect(mapStateToProps)(Relationship)
