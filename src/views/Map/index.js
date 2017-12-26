import React from 'react';
import MapPane from './MapPane'
import api from '../../api'
import './index.less'
import { Button, message, Tabs, Row, Col, Menu, Dropdown } from 'antd'

const TabPane = Tabs.TabPane;

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            building:{},
            visible: false
        }
    }

    handleError() {

    }

    handleCancel() {
        this.setState({
            visible: false
        })
    }

    handleOk() {

    }

    handleRefrsh(){

    }

    handleClick(target) {
        this.setState({
            loading: true
        })
        api({
            url: '/building',
            method: 'get',
            data: {
                id: target === 1?1:2
            }
        }).then(res => {
            this.setState({
                loading: false
            })
            console.log('hah');
            if(res.status === 200) {
                console.log(res.data)
                this.setState({
                    building: res.data,
                    visible: true
                })
            } else {
                message.error('参数有误！' + res.data.message + ',参数为: '+ res.data.position)
            }

        }).catch(err => {
            this.setState({
                loading: false
            });
            message.error('参数有误！' + err.response.data.message)
        })
    }

    render() {
        const { visible, loading, building = {name: 'test', des: 'mdzz'} } = this.state;

        const menu = (
            <Menu>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">3rd menu item</a>
                </Menu.Item>
            </Menu>
        );

        return (
            <div id="global_map">
                <div className="map">
                    <Button type="primary" loading={loading} onClick={this.handleClick.bind(this,1)}>
                        Click me!
                    </Button>
                    <Button type="primary" loading={loading} onClick={this.handleClick.bind(this,2)}>
                        Click me!
                    </Button>
                </div>
                <div className="pane" style={{display: visible?'flex':'none'}}>
                    <div className="mask"></div>
                    <Row type='flex' justify="center" align="bottom">
                        <Col span={16}>
                            <Tabs tabPosition={'bottom'}>
                                <TabPane tab="农田" key="1"><MapPane/></TabPane>
                                <TabPane tab="医馆" key="2"><MapPane/></TabPane>
                                <TabPane tab="作坊" key="3"><MapPane/></TabPane>
                                <TabPane tab="马场" key="4"><MapPane/></TabPane>
                                <TabPane tab="深林" key="5"><MapPane/></TabPane>
                                <TabPane tab="水库" key="6"><MapPane/></TabPane>
                                <TabPane tab="发电厂" key="7"><MapPane/></TabPane>
                                <TabPane tab="实验室" key="8"><MapPane/></TabPane>
                                <TabPane tab="地铁" key="9"><MapPane/></TabPane>
                                <TabPane tab="停车场" key="10"><MapPane/></TabPane>
                                <TabPane tab="池塘" key="11"><MapPane/></TabPane>
                                <TabPane tab="油厂" key="12"><MapPane/></TabPane>
                                <TabPane tab="煤矿" key="13"><MapPane/></TabPane>
                                <TabPane tab="铁矿" key="14"><MapPane/></TabPane>

                            </Tabs></Col>
                    </Row>
                </div>



            </div>
        );
    }
}

export default Map;
