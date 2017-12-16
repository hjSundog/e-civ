import React from 'react'
import axios from 'axios'
import { Button, Radio, Row, Col } from 'antd'
//import Iconfont from '../../components/Iconfont';
import CharactorCard from './CharactorCard';
import './index.less'



export default class Charactor extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            loading: false,
        }
    }

    componentWillMount () {
    }
    handleCreatePerson() {
        this.setState({
            loading: true
        })
        axios.post('/persons')
            .then(res => {
                console.log(res)
                if(res.state === 200){
                    this.setState({
                        loading: false
                    })
                    //console.log(person.name);
                }
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
                        <CharactorCard callback={this.handleCreatePerson}/>
                    </Col>
                </Row>

            </div>
        )
    }
}
