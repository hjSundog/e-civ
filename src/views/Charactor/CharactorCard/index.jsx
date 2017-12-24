import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Select, Row, Col, Radio, Button, Input, Tooltip } from 'antd'
import NumericInput from '../../../components/NumericInput'
import './index.less'

const Option = Select.Option
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const skins = ['black', 'yellow', 'white']

//先把属性写死，以后考虑属性通过属性传递来动态生成

class CharactorCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            charactor: {
                name: 'mddd',
                des: '',
                meta: {
                    age: 22,
                    sex: 'female',
                    skin: 'yellow',
                    height: 170,
                    weight: 70
                }
            }
        }
    }

    componentWillMount() {
    }

    handleSkinChange(value) {
        const charactor = this.state.charactor
        charactor.meta.skin = value
        this.setState({
            charactor
        })
    }
    //提交创建的角色
    handleSubmit(){
        console.log(this.state.charactor)
        this.props.callback(this.state.charactor);
    }

    handlFilterOption(input, option) {
        return option.props.children.toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
    }

    handleHeightChange(value) {
        const charactor = this.state.charactor
        charactor.meta.height = value
        this.setState({
            charactor
        })
    }
    handleWeightChange(value) {
        const charactor = this.state.charactor
        charactor.meta.weight = value
        this.setState({
            charactor
        })
    }

    handleName(e) {
        const charactor = this.state.charactor
        charactor.name = e.target.value.replace(/(^\s*)|(\s*$)/g, "")
        this.setState({
            charactor
        })
    }
    handleDes(e) {
        const charactor = this.state.charactor
        charactor.des = e.target.value.replace(/(^\s*)|(\s*$)/g, "")
        this.setState({
            charactor
        })
    }

    handleSex(e){
        const charactor = this.state.charactor
        charactor.meta.sex = e.target.value.replace(/(^\s*)|(\s*$)/g, "")
        this.setState({
            charactor
        })
    }

    render() {
        const skinsOptions = skins.map(skin => {
            return <Option key={skin}>{skin}</Option>
        })

        return (
            <div>
                <Row>
                    <Col span={16} style={{ height: '500px' }}>
                        这里显示人物形象
                    </Col>
                    <Col span={8}>
                        <Row>
                            <Col>
                                <Input placeholder="昵称" onChange={this.handleName.bind(this)} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Input placeholder="自我介绍" onChange={this.handleDes.bind(this)} />
                            </Col>
                        </Row>
                        <Row >
                            <Col span={6}>肤色:</Col>
                            <Col span={18} >
                                <Select
                                    defaultValue="yellow"
                                    showSearch
                                    placeholder="select your skin"
                                    optionFilterProp="children"
                                    onChange={this.handleSkinChange.bind(this)}
                                    onFocus={this.handleSkinFocus}
                                    onBlur={this.handleSkinBlur}
                                    filterOption={this.handlSkinFilterOption}>
                                    {skinsOptions}
                                </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>身高:</Col>
                            <Col span={18}>
                                <NumericInput style={{ width: 120 }} value={this.state.charactor.meta.height} onChange={this.handleHeightChange.bind(this)} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>体重:</Col>
                            <Col span={18}>
                                <NumericInput style={{ width: 120 }} value={this.state.charactor.meta.weight} onChange={this.handleWeightChange.bind(this)} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row justify="center" style={{ margin: '10px 16px' }}>
                    <Col span={24} style={{display:'flex',justifyContent:'center'}}>
                        <RadioGroup defaultValue='男' onChange={this.handleSex.bind(this)}>
                            <RadioButton value="男">男</RadioButton>
                            <RadioButton value="女">女</RadioButton>
                        </RadioGroup>
                    </Col>
                </Row>
                <Row justify="center" style={{ margin: '0 16px' }}>
                    <Col span={24} style={{display:'flex',justifyContent:'center'}}>
                        <Button type="primary" onClick={this.handleSubmit.bind(this)} loading={this.state.loading}>创建</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}

CharactorCard.defaultProps = {
    callback: () => {}
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

export default CharactorCard