import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Row, Col, message, Button } from 'antd'
//import Iconfont from '../../components/Iconfont';
import CharactorCard from './CharactorCard';
import './index.less'
import { CreateCharacter } from '@/api/person'
import { withRouter } from 'react-router'
import * as PersonActionCreators from '@/actions/person'
import { update_user, clear_user } from '@/actions/user'

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
    handleCreatePerson = (person) => {
        const { actions } = this.props;
        this.setState({
            loading: true
        })
        CreateCharacter({
            ...person
        }).then(res => {
            this.setState({
                loading: false
            })
            if (res.status === 200) {
                //res.data
                actions.create_person(res.data)
                //更新user
                //set_user()
                actions.update_user({
                    person_id: res.data.id
                })
                this.props.history.replace('/')
            }
        }).catch(err => {
            this.setState({
                loading: false
            });
            message.error(err);
        })

    }

    handleLogout = () => {
        const {actions} = this.props
        actions.clear_user()
        this.props.history.replace('/login');
    }

    render () {
        return (
            <div id="Charactor" className={`Charactor ${this.loading?'loading':''}`}>
                <Row>
                    <Button type="primary" onClick={this.handleLogout}>返回登陆界面</Button>
                </Row>
                <Row style={{ margin: '10px 16px' }}>
                    <Col span={24} >
                        <CharactorCard callback={this.handleCreatePerson} />
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
        actions: bindActionCreators({...PersonActionCreators,update_user, clear_user}, dispatch)
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Charactor))
