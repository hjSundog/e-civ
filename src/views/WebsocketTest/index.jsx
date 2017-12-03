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
                <Websocket url='ws://localhost:8089?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGlhbmd5dXlpIiwidXNlcm5hbWUiOiJsaWFuZ3l1eWkiLCJtZXRhIjp7ImFnZSI6MjIsInNleCI6Im1hbGUifSwicGVyc29uX2lkIjpudWxsLCJpYXQiOjE1MTIyOTA3NjEsImV4cCI6MTUxMjM3NzE2MX0.jpjg-EGitaqSaynYMC5OeqnyJrcS9TjlwpQziblLCkM'
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
