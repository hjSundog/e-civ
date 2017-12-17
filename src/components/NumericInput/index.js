import React from 'react'
import PropTypes from 'prop-types'
import { Select, Row, Col, Radio, Button, Input, Tooltip } from 'antd'

import './index.less'


function formatNumber(value) {
    value += '';
    const list = value.split('.');
    const prefix = list[0].charAt(0) === '-' ? '-' : '';
    let num = prefix ? list[0].slice(1) : list[0];
    let result = '';
    while (num.length > 3) {
        result = `,${num.slice(-3)}${result}`;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}

//数字输入框组件
class NumericInput extends React.Component {
    onChange = (e) => {
        const { value } = e.target;
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            this.props.onChange(value);
        }
    }
    onBlur = () => {
        const { value, onBlur, onChange } = this.props;
        if (value.charAt(value.length - 1) === '.' || value === '-') {
            onChange({ value: value.slice(0, -1) });
        }
        if (onBlur) {
            onBlur();
        }
    }
    render() {
        const { value } = this.props;
        const title = value ? (
            <span className="numeric-input-title">
                {value !== '-' ? formatNumber(value) : '-'}
            </span>
        ) : 'Input a number';
        return (
            <Tooltip
                trigger={['focus']}
                title={title}
                placement="topLeft"
                overlayClassName="numeric-input"
            >
                <Input
                    {...this.props}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    placeholder="Input a number"
                    maxLength="25"
                />
            </Tooltip>
        );
    }
}

NumericInput.defaultProps = {

}

NumericInput.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.object        
    ),
    callback: PropTypes.func
}


export default NumericInput