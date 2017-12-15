import React from 'react';
import Websocket from '@/components/Websocket'

class WebsocketTest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
        }
    }

    handleData(data) {
        let result
        try {
            result = JSON.parse(data);
        } catch(e) {
            console.log(e);
            return;
        }
        this.setState({
            messages: this.state.messages.concat(result)
        })
    }

    render() {
        return (
            <div>
                <Websocket url='ws://localhost:8089?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImFkbWluIiwibWV0YSI6eyJhZ2UiOjIyLCJzZXgiOiJtYWxlIn0sInBlcnNvbl9pZCI6bnVsbCwiaWF0IjoxNTEyMzc5OTc4LCJleHAiOjIyNjk3NjIzNzh9.grCzWUCxgijvOfgecQ-GUD0sssPHSY9bLRX2kYyLO_A'
                    onMessage={this.handleData.bind(this)}/>
                <div>
                    {
                        this.state.messages.map((item) => {
                            return <p key={item.id}>{`${item.content}`}</p>
                        })
                    }
                </div>
            </div>
        );
    }
}

export default WebsocketTest;
