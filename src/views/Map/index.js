import React from 'react';
import api from '../../api'
import './index.less'
import { Button, message } from 'antd'

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
                <div className="show_info" style={{display: visible?'':'none'}}>
                    <div className="mask"></div>
                    <div className="info">
                        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1514213554091&di=7275f7e3745ed593d05fc71e84d56b5d&imgtype=0&src=http%3A%2F%2Fpic31.nipic.com%2F20130718%2F12606377_200853832000_2.jpg" alt="建筑图片"/>
                        <div>
                            <span>{building.name}</span>
                            <span>{building.des}</span>
                            <span>{building.guild}</span>
                            <span>{building.owner}</span>
                        </div>
                    </div>
                    <div className="op">
                        <div>疗伤</div>
                        <div>维护</div>
                        <div>其他什么鬼动作</div>
                    </div>
                    <div className="other">
                        <Button type="primary" onClick={this.handleRefrsh.bind(this)}></Button>
                    </div>
                </div>

            </div>
        );
    }
}

export default Map;
