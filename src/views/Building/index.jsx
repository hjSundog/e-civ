import React from 'react';
import {Form, Row, Col, InputNumber, Input, Select, Button} from 'antd';
import PropTypes from 'prop-types'
import './index.less';
const FormItem = Form.Item
const Option = Select.Option


const types = ['Farm', 'Hotel', 'Hospital']


class Building extends React.Component {

    constructor(props) {
        super(props);

    }



    handleCancel = () => {

    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                // this.props.callback(values);
            }
        }); 
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {title} = this.props;
        const options = types.map(type => {
            return <Option value={type} key={type}>{type}</Option>
        })
        return (
            <Form className='Building' style={{padding:'20px', width: 500, border: '1px solid blue'}}>
                {/* <Row style={{ display:'flex', margin: '0 16px' }}>
                    {title}
                </Row> */}
                <Row justify="center" style={{display:'flex', justifyContent: 'space-around', margin: '10px 16px' }}>
                    <Col>
                        <FormItem label="名字">
                            {getFieldDecorator('name', {
                                rules: [{
                                    whitespace: true
                                }],
                            })(
                                <Input placeholder="building name"></Input>
                            )}
                        </FormItem>
                    </Col>
                    <Col style={{width: 160}}> 
                        <FormItem label="类型">
                            {getFieldDecorator('type', {
                                rules: [],
                                initialValue: 'Farm'
                            })(
                                <Select>
                                    {options}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row style={{display:'flex', justifyContent: 'space-around', margin: '10px 16px' }}>
                    <Col style={{ display: 'flex', justifyContent: 'center' }}>
                        <FormItem label="纬度">
                            {getFieldDecorator('lat', {
                                rules: [{
                                    required: true,
                                    message: 'Please input lat position'
                                }],

                            })(
                                <InputNumber placeholder='-85--85' min={-85} max={85} step={0.0001}/> 
                            )}
                        </FormItem>
                    </Col>
                    <Col style={{ display: 'flex', justifyContent: 'center' }}>
                        <FormItem label="精度"> 
                            {getFieldDecorator('lon', {
                                rules: [{
                                    required: true,
                                    message: 'Please input lon position'
                                }],
                            })(
                                <InputNumber placeholder='-180--180' min={-180} max={180} step={0.0001} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row justify="center" style={{ margin: '0 16px' }}>
                    <Col style={{ display: 'flex', justifyContent: 'center' }}>
                        <FormItem >
                            <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>创建</Button>
                            <Button type="primary" onClick={this.handleCancel}>取消</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const FormBuilding = Form.create()(Building);

Building.defaultProps = {
    title: '建筑创建'
}

Building.propTypes = {
    title: PropTypes.string
}

export default FormBuilding
