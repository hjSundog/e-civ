import React from 'react'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu"
import PropTypes from 'prop-types'
// import api from '../../api';
import './index.less'
// 物品组件，支持单击查看详细信息，鼠标悬挂显示简略信息，右键操作功能
function collect(props) {
    return { name: props.name };
}


const itemStyle = {
    outerStyle: {
        position: 'relative'
    },
    abstractStyle: {
        display: 'none',
        position: 'fixed',
        background: '#f3f3f3',
        flexDirection: 'column',
        padding: '10px',
        fontSize: '16px',
        maxWidth: '300px',
        alignItems: 'flexstart',
        justifyContent: 'center',
        zIndex: 1,
    }
}

class ItemContextMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            x: 0,
            y: 0,
            isVisible: false
        }
    }

    // 处理点击事件
    handleClick = (e, data, target) => {
        typeof this.props.onContextMenuClick === 'function' ? this.props.onContextMenuClick(e, data, target) : null;
    }

    abstractRef = (r) => {
        this.abs = r;
    }

    // 好像斌没啥用
    getAbstractPosition(x = 0, y = 0) {
        const menuStyles = {
            top: y,
            left: x
        };

        if (!this.abs) return menuStyles;

        const { innerWidth, innerHeight } = window;
        const rect = this.abs.getBoundingClientRect();

        if (y + rect.height > innerHeight) {
            menuStyles.top = rect.height;
        }

        if (x + rect.width > innerWidth) {
            menuStyles.left = rect.width;
        }

        if (menuStyles.top < 0) {
            menuStyles.top = rect.height < innerHeight ? (innerHeight - rect.height) / 2 : 0;
        }

        if (menuStyles.left < 0) {
            menuStyles.left = rect.width < innerWidth ? (innerWidth - rect.width) / 2 : 0;
        }

        return menuStyles;
    }

    // 这个函数需要改进一下
    handleItemDetail = (e) => {
        const self = this;
        self.abs.style.display = 'flex';
        self.abs.style.left = e.clientX + 'px';
        self.abs.style.top = e.clientY + 'px';
        //console.log(e.clientX+'px' + ':' + e.clientY+'px');
    }

    // 事件节流
    debounce = (fn, delay) => {
        var delay = delay || 1000;
        var that = this;
        return function () {
            var args = arguments;
            if (that.timer) {
                clearTimeout(that.timer);
            }
            const pram = {
                clientX: args[0].nativeEvent.clientX,
                clientY: args[0].nativeEvent.clientY
            }
            that.timer = setTimeout(function () {
                that.timer = null;
                fn.call(that, pram);
            }, delay)
        }
    }

    // 由于item-info 和img 可能重叠导致触发onMouseLeave事件，以至于闪烁问题，很好解决。。todo
    handleItemDetailFade = () => {
        console.log('leave');
        this.abs.style.display = 'none';
  
        this.timer ? clearTimeout(this.timer) : null;
    }

    render() {
        const { count, item, onClickMenu, id, extraOp } = this.props;
        const attributes = {
            'datacount': count,
            className: 'menu_action'
        };
        const { isVisible } = this.state
        const self = this;
        return (
            <div className="context-menu">
                <div>
                    <ContextMenuTrigger
                        id={id} name={item.name}
                        holdToDisplay={1000}
                        collect={collect} attributes={attributes}>
                        <div style={itemStyle.outerStyle}>
                            <img onClick={onClickMenu} onMouseLeave={this.handleItemDetailFade} onMouseMove={this.debounce(this.handleItemDetail)} src={item.icon || 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1519471427785&di=e70781b51434dba6673f4191716104c3&imgtype=0&src=http%3A%2F%2Fpic35.photophoto.cn%2F20150601%2F0005018349076194_b.png'} alt="item pic" />
                            <div className="item-info" style={isVisible ? { ...itemStyle.abstractStyle, display: 'flex' } : itemStyle.abstractStyle} ref={this.abstractRef}>
                                <span>{item.name}</span>
                                <span>{item.description}</span>
                            </div>
                            <span className="item-count">{'X ' + count}</span>
                        </div>
                    </ContextMenuTrigger>
                </div>
                {
                    extraOp.length ?
                        <ContextMenu id={id}>
                            {extraOp.map((op, index) => {
                                return (
                                    <MenuItem key={index} onClick={this.handleClick} data={{ action: op.action, item: item }}>{op.action_name}</MenuItem>
                                )
                            })}
                        </ContextMenu>
                        : null
                }

            </div>
        );
    }
}

ItemContextMenu.defaultProps = {
    id: 'unique_identifier',
    count: 0,
    item: {},           //组件填充内容
    onClickMenu: () => { },    //传入点击组件回调函数
    extraOp: [],
    onContextMenuClick: () => { }
};

ItemContextMenu.propTypes = {
    id: PropTypes.string,
    item: PropTypes.object,
    count: PropTypes.number,
    onClickMenu: PropTypes.func,
    extraOp: PropTypes.arrayOf(PropTypes.shape({    // 自定义操作
        action: PropTypes.string,
        action_name: PropTypes.string,
    })),
    onContextMenuClick: PropTypes.func
};



export default (ItemContextMenu)