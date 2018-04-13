import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Select, Row, Col, Radio, Button, Input, Upload, Modal, Icon, message } from 'antd'
import NumericInput from '../../../components/NumericInput'
import AvatarUpload from '../AvatarUpload'

const FormItem = Form.Item
const Option = Select.Option
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
import './index.less'

const skins = ['black', 'yellow', 'white']

//先把属性写死，以后考虑属性通过属性传递来动态生成

class CharactorCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (!values.description) {
                    values.description = '这人很懒，什么描述都没有...';
                }
                // console.log('Received values of form: ', values);
                this.props.callback(values);
            }
        });
    }


    validateDescription = () => {

    }

    validateNickName = () => {

    }

    validateHeight = () => {

    }

    validateWeight = () => {

    }


    handleAvatarUpload = (dataUrl, reader) => {
        this.setState({
            extra: dataUrl
        })
        return dataUrl;
    }

    render() {
        const skinsOptions = skins.map(skin => {
            return <Option key={skin}>{skin}</Option>
        })

        const { getFieldDecorator } = this.props.form;

        return (
            <Form>
                <Row>
                    <Col span={8}>
                        <FormItem label="昵称">
                            {getFieldDecorator('nickname', {
                                rules: [{
                                    required: true,
                                    message: 'Please input your nickname',
                                    whitespace: true
                                }]
                            })(
                                <Input placeholder="your nickname here !" />
                            )}
                        </FormItem>
                        <FormItem label='说点什么'>
                            {getFieldDecorator('description', {
                                rules: [{
                                    whitespace: true
                                }],
                                initialValue: ''
                            })(
                                <Input placeholder="introduce yourself !" />
                            )}
                        </FormItem>
                        <FormItem label='肤色'>
                            {getFieldDecorator('skin', {
                                rules: [{
                                    required: true, message: 'Please select your skin'
                                }],
                                initialValue: 'yellow'
                            })(
                                <Select
                                    showSearch
                                    placeholder="select your skin"
                                    optionFilterProp="children"
                                    onFocus={this.handleSkinFocus}
                                    onBlur={this.handleSkinBlur}
                                    filterOption={this.handlSkinFilterOption}>
                                    {skinsOptions}
                                </Select>
                            )}
                        </FormItem>

                        <FormItem label='身高'>
                            {getFieldDecorator('height', {
                                rules: [{
                                    required: true, message: 'Please input your height'
                                }],
                                initialValue: '170'
                            })(
                                <NumericInput style={{ width: 120 }} />
                            )}
                        </FormItem>

                        <FormItem label='体重'>
                            {getFieldDecorator('weight', {
                                rules: [{
                                    required: true, message: 'Please input your weight'
                                }],
                                initialValue: '60'
                            })(
                                <NumericInput style={{ width: 120 }} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={16} style={{ height: '500px' }}>
                        <FormItem >
                            {getFieldDecorator('avatar', {
                                trigger: 'callback'
                            })(
                                <AvatarUpload callback={this.handleAvatarUpload}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row justify="center" style={{ margin: '10px 16px' }}>
                    <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                        <FormItem>
                            {getFieldDecorator('sex', {
                                rules: [],
                                initialValue: '男'
                            })(
                                <RadioGroup >
                                    <RadioButton value="男">男</RadioButton>
                                    <RadioButton value="女">女</RadioButton>
                                </RadioGroup>
                            )}
                        </FormItem>

                    </Col>
                </Row>
                <Row justify="center" style={{ margin: '0 16px' }}>
                    <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                        <FormItem >
                            <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>创建</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

const CharacterCard = Form.create()(CharactorCard);

CharactorCard.defaultProps = {
    callback: () => { }
}

CharactorCard.propTypes = {
    callback: PropTypes.func
}


// function mapStateToProps(state) {
//     return state
// }

// function mapDispatchToProps(dispatch) {
//     return {

//     }
// }

export default CharacterCard
