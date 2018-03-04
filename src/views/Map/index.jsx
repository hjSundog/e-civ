import React from 'react';
import MapPane from './MapPane'
import DropDownTab from './DropDownTab'
import api from '../../api'
import './index.less'
import { Button, message, Tabs, Row, Col, Menu, Dropdown } from 'antd'
import Globe, {GlobeOptions} from 'e-civ-planet';

const TabPane = Tabs.TabPane;
const SubMenu = Menu.SubMenu;

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            building:{},
            visible: false,
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
            if(res.status === 200) {
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

    handleSwitchBuilding(target) {
        this.setState({
            target: target
        })
    }

    componentDidMount() {
        console.log('md')
        var options = new GlobeOptions();
        options.satellite = true;
        options.level = 2;
        options.lonlat = 'auto';
        const globe = Globe.getInstance(options);
        const container = document.querySelector('#global_map');
        const content = document.querySelector('.ant-layout-content');
        globe.placeAt(container);
        globe.resize(content.clientWidth, content.clientHeight)
        globe.updateUserLocation({
            lon: 12.3,
            lat: 30,
            accuracy: 500,
        })
    }

    render() {
        const { visible, loading, building = {name: 'test', des: 'mdzz'} } = this.state;
        const data = [
            {
                name: '水稻田',
                id: 5
            },{
                name: '麦田',
                id: 4
            },{
                name: '土豆田',
                id: 3
            },{
                name: '棉花田',
                id: 2
            }
        ]
        return (
            <div id="global_map">
                <div className="map-controller">
                    <Button type="primary" loading={loading} onClick={this.handleClick.bind(this,1)}>
                        Click me!
                    </Button>
                    <Button type="primary" loading={loading} onClick={this.handleClick.bind(this,2)}>
                        Click me!
                    </Button>
                </div>
                {/* <div className="pane" style={{display: visible?'flex':'none'}}>
                    <div className="mask"></div>
                    <Row type='flex' justify="center" align="bottom">
                        <Col span={16}>
                            <Tabs tabPosition={'bottom'}>
                                <TabPane tab={<DropDownTab type="农田"  data={data} cb={this.handleSwitchBuilding.bind(this)} position="bottomCenter"></DropDownTab>} key="1">
                                    <MapPane target={this.state.target}/>
                                </TabPane>
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
                </div> */}
            </div>
        );
    }
}

export default Map;
