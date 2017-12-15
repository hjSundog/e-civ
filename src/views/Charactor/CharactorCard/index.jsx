import React from 'react'
import { Select, Row, Col } from 'antd'
//import Iconfont from '../../components/Iconfont';
import './index.less'

const Option = Select.Option

const skins = ['black', 'yellow', 'white']

const provinceData = ['Zhejiang', 'Jiangsu'];
const cityData = {
    Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
    Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
};

const heightData = ['150']

export default class CharactorCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cities: cityData[provinceData[0]],
            secondCity: cityData[provinceData[0]][0],
        }
    }

    componentWillMount() {
    }

    callback() {

    }

    handleChange() {

    }

    handleFocus() {

    }

    handleBlur() {

    }


    handlFilterOption(input, option) {
        return option.props.children.toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
    }

    handleProvinceChange = (value) => {
        this.setState({
            cities: cityData[value],
            secondCity: cityData[value][0],
        });
    }

    onSecondCityChange = (value) => {
        this.setState({
            secondCity: value,
        });
    }
    handleHeightChange() {

    }

    render() {
        const skinsOptions = skins.map(skin => {
            return <Option key={skin}>{skin}</Option>
        })

        const cityOptions = this.state.cities.map(city => {
            return <Option key={city}>{city}</Option>
        })

        const provinceOptions = provinceData.map(province => {
            return <Option key={province}>{province}</Option>
        })
        const heigthOptions = heightData.map(height => {
            return <Option key={height}>{height}</Option>
        })

        return (
            <div>
                <Row>
                    <Col span={16} style={{ height: '500px' }}>
                        这里显示人物形象
                    </Col>
                    <Col span={8}>
                        <Row >
                            <Col span={6}>肤色:</Col>
                            <Col span={18} >
                                <Select
                                    defaultValue="yellow"
                                    showSearch
                                    placeholder="select your skin"
                                    optionFilterProp="children"
                                    onChange={this.handleChange}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    filterOption={this.handlFilterOption}>
                                    {skinsOptions}
                                </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>身高:</Col>
                            <Col span={18}>
                                <Select
                                    mode="tags"
                                    placeholder="Tags Mode"
                                    onChange={this.handleHeightChange}
                                >
                                    {heigthOptions}
                                </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>城市：</Col>
                            <Col span={18} >
                                <Select defaultValue={provinceData[0]} onChange={this.handleProvinceChange}>
                                    {provinceOptions}
                                </Select>
                                <Select value={this.state.secondCity} onChange={this.onSecondCityChange}>
                                    {cityOptions}
                                </Select>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
}
