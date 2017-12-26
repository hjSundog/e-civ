import React from 'react';
import './index.less'
import { Button, message, Tabs, Row, Col, Card, Avatar } from 'antd'

const TabPane = Tabs.TabPane;

const gridStyle = {
    width: '25%',
    textAlign: 'center',
};

class MapPane extends React.Component {

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

    handleRefresh(){

    }

    render() {
        const { visible, building = {name: 'test', des: 'mdzz'} } = this.state;
        return (
            <div>
                <div className="show_info" >
                    <div className="info">
                        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1514213554091&di=7275f7e3745ed593d05fc71e84d56b5d&imgtype=0&src=http%3A%2F%2Fpic31.nipic.com%2F20130718%2F12606377_200853832000_2.jpg" alt="建筑图片"/>
                        <div className="info_holder">
                            <img src="https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1514291292&di=553867e010ae42dc355cf5dbc390e7d1&src=http://img.zcool.cn/community/0173cb5666920932f8754573b2f2b6.jpg@2o.jpg" alt="建筑图片"/>
                            <div className="detail_info">
                                <div className="base_info">
                                    <span className="name">医馆</span>
                                    <span>lv3</span>
                                    <span className="guild">
                                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                    </span>
                                    <span className="owner">
                                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                    </span>
                                </div>

                                <div className="earn">
                                    <p>收益：20Gold</p>
                                    <p>坐标：2 2</p>
                                </div>
                                <div className="target_info">
                                    <div className="material">
                                        <span>建筑所需：</span>
                                        <ul>
                                            <li>石料30单位</li>
                                            <li>铁50单位</li>
                                            <li>1000Gold</li>
                                            <li>5day</li>
                                        </ul>
                                    </div>
                                    <div className="effect">
                                        <span>效果：</span>
                                        <ul>
                                            <li>立即恢复50%生命值</li>
                                            <li>连续一天自然精力恢复加倍</li>
                                            <li>驱散烧伤，冰冻等debuff</li>
                                            <li>。。。</li>
                                        </ul>
                                    </div>
                                </div>
                                <span>治病救人的地方,如果你还没死，就可以在这里慢慢恢复你的生命值，级别越高恢复生命体力值就越快</span>
                            </div>
                        </div>
                    </div>
                    <div className="op">
                        <Card title="操作">
                            <Card.Grid style={gridStyle}>疗伤</Card.Grid>
                            <Card.Grid style={gridStyle}>新建一个医馆</Card.Grid>
                            <Card.Grid style={gridStyle}>摧毁这个医馆</Card.Grid>
                            <Card.Grid style={gridStyle}>设置收费</Card.Grid>
                        </Card>
                    </div>
                    <div className="other">
                        <Button type="primary" onClick={this.handleRefresh.bind(this)}>报告错误</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default MapPane;
