import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Row, Col, message } from 'antd'
//import Iconfont from '../../components/Iconfont';
import CharactorCard from './CharactorCard';
import './index.less'
import api from '../../api'
import { withRouter } from 'react-router'
import * as PersonActionCreators from '@/actions/person'
import { update_user } from '@/actions/user'
class Charactor extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            loading: false,
        }
    }

    componentWillMount () {
        //
    }
    //这里有个问题。因为创建一个角色，user信息也会跟着变化，所以这里采取创建一个角色成功后将该id直接加入
    //加入redux进行保存以保持和后台同步而不是重新获取数据库user来更新redux
    handleCreatePerson(person) {
        this.setState({
            loading: true
        })
        api({
            url: '/persons',
            method: 'post',
            data: {
                ...person
            }
        }).then(res => {
            this.setState({
                loading: false
            })
            if (res.status === 200) {
                //res.data
                console.log('charactor create')
                console.log(res.data)
                this.props.actions.create_person(res.data)
                //更新user
                //set_user()

                this.props.actions.update_user({
                    person_id: res.data._id
                })
                const user = JSON.parse(localStorage.getItem('user'));
                localStorage.removeItem('user');
                localStorage.setItem('user',JSON.stringify({
                    ...user,
                    person_id: res.data._id
                }))
                this.props.history.replace('/')
            }
        }).catch(err => {
            this.setState({
                loading: false
            });
            message.error(err);
        })

    }
    render () {
        return (
            <div id="Charactor" className={`Charactor ${this.loading?'loading':''}`}>
                <Row>
                    这里可以添加其他的东西，下面是ChractorCard组件
                </Row>
                <Row style={{ margin: '10px 16px' }}>
                    <Col span={24} >
                        <CharactorCard callback={this.handleCreatePerson.bind(this)}/>
                    </Col>
                </Row>

            </div>
        )
    }
}

function mapStateToProps (state) {
    const { user } = state;
    return {
        user: user || {},
    };
}

function mapDispatchToProps (dispatch) {
    return {
        actions: bindActionCreators({...PersonActionCreators,update_user}, dispatch)
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Charactor))
