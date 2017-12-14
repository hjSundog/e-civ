import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SendIcon from './icons/SendIcon';


class UserInput extends Component {

    constructor() {
        super();
        this.state = {
            inputActive: false,
        };
    }

    handleKey = (event) => {
        // 回车直接发送
        if (event.keyCode === 13 && !event.shiftKey) {
            this._submitText(event);
        }
    }
    _onFocus = () => {
        this.setState({ inputActive: true });
    }
    _onBlur = () => {
        this.setState({ inputActive: false });
    }

    _submitText = (event) => {
        event.preventDefault();
        const text = this.userInput.textContent;
        if (text && text.length > 0) {
            this.props.onSubmit({
                author: 'me',
                type: 'text',
                data: { text }
            });
            this.userInput.innerHTML = '';
        }
    }

    render() {
        return (
            <form className={`sc-user-input ${(this.state.inputActive ? 'active' : '')}`}>
                <div
                    role="button"
                    tabIndex="0"
                    onFocus={this._onFocus}
                    onBlur={this._onBlur}
                    ref={(e) => { this.userInput = e; }}
                    onKeyDown={this.handleKey}
                    contentEditable="true"
                    placeholder="说些什么..."
                    className="sc-user-input--text"
                >
                </div>
                <div className="sc-user-input--buttons">
                    <div className="sc-user-input--button"></div>
                    <div className="sc-user-input--button">
                        <SendIcon onClick={this._submitText} />
                    </div>
                </div>
            </form>
        );
    }
}

UserInput.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default UserInput;
