import React from 'react';

class Donation extends React.Component {

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
                <div id="alipay">
                    <p>test</p>
                    <img src={require("./alipay_test.jpg")} />
                </div>
            </div>
        );
    }
}

export default Donation;
