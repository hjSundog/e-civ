import React from 'react';
import PropTypes from 'prop-types'
import './index.less'
import api from '../../../api'
import { Button, message, Tabs, Row, Col, Card, Avatar } from 'antd'

const TabPane = Tabs.TabPane;

const gridStyle = {
    width: '80px',
    textAlign: 'center',
    padding: '10px'
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

    //属性更改之后
    componentWillReceiveProps(nextProps) {
        if (nextProps === this.props.target) {
            return;
        }
        //刷新界面信息
        this.getBuildingInfo(nextProps.target);
    }

    async getBuildingInfo(target){
        this.setState({
            loading: true
        })
        api({
            url: '/building',
            method: 'get',
            data: {
                id: target
            }
        }).then(res => {
            this.setState({
                loading: false
            })
            if (res.status === 200) {
                console.log('获取建筑信息成功');
                console.log(res.data);
            }
        }).catch(err => {
            this.setState({
                loading: false
            });
            message.error(err);
        })
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
        const {target} = this.props;
        console.log('现在你看到的是id为%d的建筑信息',target);
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
                        <Card>
                            <Card.Grid style={gridStyle}>疗伤</Card.Grid>
                            <Card.Grid style={gridStyle}>新建</Card.Grid>
                            <Card.Grid style={gridStyle}>卖出医馆</Card.Grid>
                            <Card.Grid style={gridStyle}>租借医馆</Card.Grid>
                            <Card.Grid style={gridStyle}>升级</Card.Grid>
                            <Card.Grid style={gridStyle}>摧毁</Card.Grid>
                            <Card.Grid style={gridStyle}>设置</Card.Grid>
                        </Card>
                    </div>
                    <div className="similar">

                    </div>
                    <div className="other">
                        <Button type="primary" onClick={this.handleRefresh.bind(this)}>到这里去</Button>
                        <Button type="primary" onClick={this.handleRefresh.bind(this)}>离开</Button>
                        <Button type="primary" onClick={this.handleRefresh.bind(this)}>报告错误</Button>
                    </div>
                </div>
            </div>
        );
    }
}

MapPane.defaultProps = {
    target: 0
}

MapPane.propTypes = {
    target: PropTypes.number
}

export default MapPane;
