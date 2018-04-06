import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import noop from '@/utils/noop'
import Iconfont from '@/components/Iconfont'
import { Avatar, Button, Card, Icon, InputNumber, message } from 'antd'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {making_bid} from '@/actions//items'
const { Meta } = Card
import './index.less'
class AuctionItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            extraTime: {
                day: 0,
                hour: 0,
                minute: 0,
                second: 0
            },
            nowPrice: 0
        }
    }

    componentDidMount() {

        let timer = setInterval(this.countTime, 1000);
    }

    countTime = () => {
        let time = this.props.data.item.endTime;
        let leftTime = time - Date.now();
        var d, h, m, s;

        if (leftTime >= 0) {
            d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
            h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
            m = Math.floor(leftTime / 1000 / 60 % 60);
            s = Math.floor(leftTime / 1000 % 60);
            this.setState({
                extraTime: {
                    day: d,
                    hour: h,
                    minute: m,
                    second: s
                }
            })
        } else {
            this.destroyComponent();
        }
    }

    destroyComponent = () => {
        this === null;
    }

    componentWillUnmount() {
        this.timer?clearInterval(this.timer):null
    }

    // 价格更改
    onAuctionPriceChange = (value) => {
        this.setState({
            nowPrice: value
        })
    }
    // 确认出价
    onSurePrice = () => {
        const prePrice = this.props.data.item.auctioner.price;
        const nowPrice = this.state.nowPrice;
        if (prePrice >= nowPrice) {
            message.info('请输入大于别的玩家的价格', 1000)
        } else {
            const {user, data} = this.props
            console.log('success:' + data.item._id);
            this.props.actions.making_bid({
                target: data.item._id,
                from: {
                    name: user.name,
                    price: this.state.nowPrice,
                    avatar: ''
                }
            })
        }
    }

    render() {
        const { data } = this.props
        const { item, count } = data
        const { owner_id, description, rarity, type, owner_avatar, startTime, endTime, icon, auctioner } = item
        const {day, hour, minute, second} = this.state.extraTime
        return (
            <div className='AuctionItem' style={{ marginBottom: '10px' }}>
                <Card
                    style={{ display: 'flex', flexDirection: 'row' }}
                    cover={<img className="auction_pic" alt="example" src={icon ? icon : 'https://avatars2.githubusercontent.com/u/12684886?s=400&u=e490d2d46417a6f502cb74029799fbdd66513e4c&v=4'} />}
                    actions={[
                        <div className="auction-provider">
                            <div className="provider-name">出价人:<span>{auctioner.name}</span></div>
                            <br/>
                            <div className="provider-price">出价:<span>{auctioner.price}</span></div>
                        </div>,
                        <div className="auction-leftTime">距结束还有:<br/><span>{day}天{hour}时{minute}分{second}秒</span></div>,
                        <div className="auction-op">
                            <InputNumber min={0} defaultValue={0} onChange={this.onAuctionPriceChange} />
                            <Iconfont type="trade" onClick={this.onSurePrice}></Iconfont>
                        </div>
                    ]}
                >
                    <Meta
                        avatar={<Avatar src={owner_avatar ? owner_avatar : 'https://avatars2.githubusercontent.com/u/12684886?s=400&u=e490d2d46417a6f502cb74029799fbdd66513e4c&v=4'} />}
                        title={item.name}
                        description={<div>
                            <div>描述:{description}</div>
                            <br/>
                            <div>持续时间:{new Date(startTime).toLocaleDateString()}--{new Date(endTime).toLocaleDateString()}</div>
                        </div>}
                    />
                </Card>
            </div>
        )
    }
}

AuctionItem.defaultProps = {
    data: {
        item: {},
        count: 1
    },
};

AuctionItem.propTypes = {
    data: PropTypes.shape({
        item: PropTypes.object,
        count: PropTypes.number,
    }),
};

function mapStateToProps(state) {

    return {
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({making_bid}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuctionItem);
