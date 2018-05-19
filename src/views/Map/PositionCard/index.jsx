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

class BuildingCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tabKey: 'info',
            loading: false,
            visible: false
        }

    }
    //属性更改之后
    componentWillReceiveProps(nextProps) {
        if (nextProps === this.props.target) {
            return;
        }
        console.log(nextProps)
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

    // 从当前位置到Building
    go = () => {
        const {position} = this.props;
        this.props.handleGo(position)
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
        const { position } = this.props
        if(!this.state.visible || !position) {
            return null
        }
        const contentList = {
            info: (<div className="info">
                <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1514213554091&di=7275f7e3745ed593d05fc71e84d56b5d&imgtype=0&src=http%3A%2F%2Fpic31.nipic.com%2F20130718%2F12606377_200853832000_2.jpg" alt="建筑图片"/>
                <div className="info-main">
                    <div className="info-detail">
                        <div className="base">
                            <span className="name">{`${position.meta.name}`}</span>
                            {/* <span>lv3</span> */}
                        </div>
                        <div className="effect">
                            <div className="effect">
                                <span>{`${position.type} - ${position.meta.type}`}</span>
                            </div>
                        </div>
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
                <Button type="primary" onClick={ this.go } >到这里去</Button>
                <Button type="primary" >离开</Button>
            </div>)
        };
        return (
            <div className="position-card">
                <Card
                    style={{ width: '100%' }}
                    title={`${position.meta.name} [${position.type}]`}
                    extra={[<a className="position-more" key="more" href="#">More</a>,<a className="position-close" key="close" onClick={this.hide}>关闭</a>]}
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
