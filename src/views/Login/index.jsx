import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Icon, message } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import api from '../../api'
import { set_user, remove_user } from '../../actions/user'
const FormItem = Form.Item

import './index.less'

const propTypes = {
    user: PropTypes.object,
};

class Login extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            form: {

            }
        }
    }

    handleSubmit (e) {
        e.preventDefault();
        this.setState({
            loading: true
        });
        const data = this.props.form.getFieldsValue()
        api({
            url: '/users/login',
            method: 'post',
            params: {
                username: data.username,
                password: data.password
            }
        }).then(res => {
            this.setState({
                loading: false
            });
            if (res.status !== 200) {
                message.error(res.data.error);
            }
            if (res.status === 200)  {
                this.props.set_user(res.data)
                //判断是否已经有角色
                if (res.data.person_id ){
                    message.success('Welcome ' + res.data.name) 
                    this.props.history.replace('/')
                } else {
                    this.props.history.replace('/charactor')
                }
            }
        }).catch(err => {
            this.setState({
                loading: false
            });
        })
    }

    toSignup () {
        this.props.history.replace('/signup');
    }

    render () {
        const { getFieldDecorator } = this.props.form
        return (
            <Row className="login-row" type="flex" justify="space-around" align="middle">
                <Col span="8">
                    <Form layout="horizontal" onSubmit={this.handleSubmit.bind(this)} className="login-form">
                        <h2 className="logo"><span>logo</span></h2>
                        <FormItem>
                            {getFieldDecorator('username')(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder='admin' />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password')(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type='password' placeholder='admin' />
                            )}
                        </FormItem>
                        <p>
                            <Button className="btn-login" type='primary' size="large" icon="poweroff" loading={this.state.loading} htmlType='submit'>登录</Button>
                        </p>
                        <p>
                            <Button className="btn-register" size="large" icon="right-square-o" htmlType='button' onClick={this.toSignup.bind(this)} >去注册</Button>
                        </p>
                    </Form>
                </Col>
            </Row>

        )
    }
}

Login.propTypes = propTypes;

Login = Form.create()(Login);

function mapStateToProps(state) {
    const {auth} = state;
    if (auth.user) {
        return {user: auth.user};
    }

    return {user: null};
}

function mapDispatchToProps(dispatch) {
    return {
        set_user: bindActionCreators(set_user, dispatch),
        remove_user: bindActionCreators(remove_user, dispatch)
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))
