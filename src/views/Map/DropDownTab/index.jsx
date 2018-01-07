import React from 'react';
import PropTypes from 'prop-types'
import './index.less'
import { Menu, Dropdown } from 'antd'



class DropDownTab extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClick(target){
        this.props.cb(target);
    }

    render() {
        const {data, position, type, show} = this.props;
        const menu = (
            <Menu>
                {data.map((d, i) => {
                    return <Menu.Item key={i}><div onClick={this.handleClick.bind(this,d['id'])}>{d[show]}</div></Menu.Item>
                })}
            </Menu>);
        return (
            <Dropdown overlay={menu} placement={position}>
                <div>{type}</div>
            </Dropdown>
        );
    }
}

DropDownTab.defaultProps = {
    data: [],
    position: 'bottomLeft',
    type: '方寸之地',
    show: 'name',
    cb: function(){}
}

DropDownTab.propTypes = {
    data: PropTypes.array,
    position: PropTypes.string,
    type: PropTypes.string,
    show: PropTypes.string, //显示对象那个属性
    cb: PropTypes.func
}

export default DropDownTab
