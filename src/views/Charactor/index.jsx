import React from 'react'
import { Button, Radio, Row, Col } from 'antd'
//import Iconfont from '../../components/Iconfont';
import CharactorCard from './CharactorCard';
import './index.less'
const RadioButton = Radio.Button
const RadioGroup = Radio.Group


export default class Charactor extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            loading: false
        }
    }

    componentWillMount () {
    }

    render () {

        return (
            <div>
                <Row style={{ margin: '10px 16px' }}>
                    <Col span={24} >
                        <CharactorCard />
                    </Col>
                </Row>
                <Row justify="center" style={{ margin: '10px 16px' }}>
                    <Col span={24} style={{display:'flex',justifyContent:'center'}}>
                        <RadioGroup defaultValue='男'>
                            <RadioButton value="男">男</RadioButton>
                            <RadioButton value="女">女</RadioButton>
                        </RadioGroup>
                    </Col>
                </Row>
                <Row justify="center" style={{ margin: '0 16px' }}>
                    <Col span={24} style={{display:'flex',justifyContent:'center'}}>
                        <Button type="primary" loading={this.state.loading}>创建</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}
