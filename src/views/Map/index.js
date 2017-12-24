import React from 'react';
import api from '../../api'
import './index.less'
import { Button, message, Card } from 'antd'

const { Meta } = Card;

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            position:{}
        }
    }

    handleClick(target) {
        this.setState({
            loading: true
        })
        api({
            url: '/building',
            method: 'get',
            data: {
                position: {
                    lat: target===1?30.3:32.3,
                    lng: target===1?223.2:124.3
                }
            }
        }).then(res => {
            this.setState({
                loading: false
            })
            if(res.status === 200) {
                console.log(res.data)
                this.setState({
                    position: res.data
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
        return (
            <div>
                <Button type="primary" loading={this.state.loading} onClick={this.handleClick.bind(this,1)}>
          Click me!
                </Button>
                <Button type="primary" loading={this.state.loading} onClick={this.handleClick.bind(this,2)}>
          Click me!
                </Button>
                <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                >
                    <Meta
                        title={this.state.position.name}
                        description={this.state.position.des}
                    />
                </Card>
            </div>
        );
    }
}

export default Map;
