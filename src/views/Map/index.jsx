import React from 'react';
import { getResourcesList } from '../../api/map'
import { move } from '../../api/action'
import './index.less'
import { connect } from 'react-redux'
import { Button, message } from 'antd'
import Globe, {GlobeOptions} from 'e-civ-planet';

import PositionCard from './PositionCard'


const mapStateToProps = (state) => {
    return {
        person: state.person
    }
}

@connect(mapStateToProps)
class Map extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            building: null,
            visible: false,
        }

        this.globe = null;
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

    handleShowBuildings = () => {
        this.globe.showPositions([{
            lon: 12.803629,
            lat: 30.001324,
            type: 'building',
            meta: {
                name: '矮山潭',
                class: []
            }
        }, {
            lon: 12.810400,
            lat: 30.000421,
            type: 'building',
            meta: {
                name: '桂中',
                class: []
            }
        }])
    }

    handleClearAll = () => {
        this.globe.poiLayer.clearAll();
    }

    updatePosition = () => {
        this.globe.updateUserLocation({
            lon: this.props.person.position.lon,
            lat: this.props.person.position.lat
        })
    }

    handleSwitchBuilding(target) {
        this.setState({
            target: target
        })
    }

    handleGo = (position) => {
        const { position: personPosition } = this.props.person
        if(position.lon === personPosition.lon && position.lat === personPosition.lat ) {
            message.info('兄弟，你已经到站了，别点了')
        }
        move(position).then(res => {
            this.globe.routeLayer.addRouteByLonlats([[personPosition.lon, personPosition.lat], [position.lon, position.lat]], this.globe.routeLayer.camera.getResolution(), 5, [0, 255, 0]);
        })
    }

    componentDidMount() {
        const self = this;
        var options = new GlobeOptions();
        options.satellite = true;
        options.level = 13;
        options.lonlat = 'auto';
        this.globe = Globe.getInstance(options);
        const container = document.querySelector('#global_map');
        const content = document.querySelector('.ant-layout-content');
        this.globe.placeAt(container);
        this.globe.resize(content.clientWidth, content.clientHeight)

        setTimeout(() => {
            self.updatePosition()
        }, 1000)

        // 获取资源列表
        getResourcesList().then((res) => {
            this.globe.showPositions(res.data.data.map(resource => {
                return {
                    lon: resource.position.lon,
                    lat: resource.position.lat,
                    type: 'resource',
                    meta: {
                        name: resource.name,
                        type: resource.type
                    }
                }
            }))
        })
        this.globe.poiLayer.setPickListener((target) => {
            console.log('[map] position clicked')
            self.positionCard.show()
            self.setState({
                position: target.attributes
            })
        })
    }
    componentWillUnmount() {
    }

    render() {
        const { loading, position } = this.state;
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
                    <Button type="primary" loading={loading} onClick={this.handleShowBuildings}>
                        附近的建筑物
                    </Button>
                    <Button type="primary" loading={loading} onClick={this.handleClearAll}>
                        清除所有POIs
                    </Button>
                    <Button type="primary" loading={loading} onClick={this.updatePosition}>
                        我的位置
                    </Button>
                </div>
                <PositionCard
                    ref={(card) => { this.positionCard = card; }}
                    position={position}
                    handleGo={this.handleGo}>
                </PositionCard>
            </div>
        );
    }
}

export default Map;
