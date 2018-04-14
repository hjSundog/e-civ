import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Icon, message } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { login } from '@/api/user'
import { set_user } from '../../actions/user'
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
        login({
            username: data.username,
            password: data.password
        }).then(res => {
            this.setState({
                loading: false
            });
            message.success('Welcome ' + res.data.name)
            this.props.set_user(res.data)
            this.props.history.replace('/')
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
    const {user} = state;
    if (user) {
        return {user: user};
    }

    return {user: null};
}

function mapDispatchToProps(dispatch) {
    return {
        set_user: bindActionCreators(set_user, dispatch),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))
