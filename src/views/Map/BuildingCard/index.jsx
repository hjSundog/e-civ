import React from 'react';
import PropTypes from 'prop-types'
import './index.less'
// import api from '../../../api'
import { Card, Avatar, Button } from 'antd'


const gridStyle = {
    width: '80px',
    textAlign: 'center',
    padding: '10px'
};


const tabList = [{
    key: 'info',
    tab: '介绍',
}, {
    key: 'operation',
    tab: '操作',
}, {
    key: 'other',
    tab: '其他'
}];

const contentList = {
    info: (<div className="info">
        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1514213554091&di=7275f7e3745ed593d05fc71e84d56b5d&imgtype=0&src=http%3A%2F%2Fpic31.nipic.com%2F20130718%2F12606377_200853832000_2.jpg" alt="建筑图片"/>
        <div className="info-main">
            <div className="info-detail">
                <div className="base">
                    <span className="name">医馆</span>
                    <span>lv3</span>
                    <span className="guild">
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    </span>
                    <span className="owner">
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    </span>
                </div>
                <div className="effect">
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
    </div>),
    operation: (<div className="operation">
        <Card.Grid style={gridStyle}>疗伤</Card.Grid>
        <Card.Grid style={gridStyle}>新建</Card.Grid>
        <Card.Grid style={gridStyle}>卖出医馆</Card.Grid>
        <Card.Grid style={gridStyle}>租借医馆</Card.Grid>
        <Card.Grid style={gridStyle}>升级</Card.Grid>
        <Card.Grid style={gridStyle}>摧毁</Card.Grid>
        <Card.Grid style={gridStyle}>设置</Card.Grid>
    </div>),
    other: (<div className="other">
        <Button type="primary" >到这里去</Button>
        <Button type="primary" >离开</Button>
    </div>)
};

class BuildingCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tabKey: 'info',
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
        // this.getBuildingInfo(nextProps.target);
    }

    show = () => {
        this.setState({
            visible: true
        })
    }

    hide = () => {
        this.setState({
            visible: false
        })
    }


    // async getBuildingInfo(target){
    //     this.setState({
    //         loading: true
    //     })
    //     api({
    //         url: '/building',
    //         method: 'get',
    //         data: {
    //             id: target
    //         }
    //     }).then(res => {
    //         this.setState({
    //             loading: false
    //         })
    //         if (res.status === 200) {
    //             console.log('获取建筑信息成功');
    //             console.log(res.data);
    //         }
    //     }).catch(err => {
    //         this.setState({
    //             loading: false
    //         });
    //         message.error(err);
    //     })
    // }

    handleError() {

    }

    onTabChange = (key, type) => {
        this.setState({ [type]: key });
    }

    handleCancel = () => {
        this.setState({
            visible: false
        })
    }

    handleOk() {

    }

    handleRefresh(){

    }

    render() {
        const {building} = this.props;
        if(!this.state.visible) {
            return null
        }
        return (
            <div className="building-card">
                <Card
                    style={{ width: '100%' }}
                    title={building && building.meta.name}
                    extra={[<a className="building-more" key="more" href="#">More</a>,<a className="building-close" key="close" onClick={this.hide}>关闭</a>]}
                    tabList={tabList}
                    onTabChange={(key) => { this.onTabChange(key, 'tabKey'); }}
                >
                    {contentList[this.state.tabKey]}
                </Card>
            </div>
        );
    }
}

BuildingCard.defaultProps = {
    target: 0
}

BuildingCard.propTypes = {
    // building: PropTypes.oneOf([
    //     PropTypes.object.isRequired,
    //     null
    // ])
}

export default BuildingCard;
