import React from 'react'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu"
import PropTypes from 'prop-types'
// import api from '../../api';

import './index.less'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {update_person} from '@/actions/person'
// 物品组件，支持单击查看详细信息，鼠标悬挂显示简略信息，右键操作功能
function collect(props) {
    return { name: props.name };
}


const itemStyle = {
    outerStyle: {
        position: 'relative'
    },
    abstractStyle: {
        //opacity: 0,
        display: 'none',
        position: 'fixed',
        background: '#f3f3f3',
        flexDirection: 'column',
        padding: '10px',
        fontSize: '16px',
        maxWidth: '300px',
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex: 1,
    }
}

class ItemContextMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            x:  0,
            y: 0,
            isVisible: false
        }
    }

    handleClick(e, data, target)  {
        const count = parseInt(target.getAttribute('data-count'), 10);
        const {actions, person} = this.props
        if (data.action === 'USE') {
            console.log('你使用这个物品了');
            Object.entries(data.item.effect).forEach(function(ele) {
                //递归寻找对象是否有这个属性
                function recursion(target) {
                    for(let key in target) {
                        //建相等
                        if(key === ele[0]) {
                            //如果值为对象
                            if(toString.call(target[key]).slice(8, -1) === 'Object') {
                                //建相等,这里先简单的这样做，不考虑深度克隆的情况
                                target[key] = {
                                    ...target[key],
                                    ...ele[1]
                                }
                            } else {          
                                target[key] = target[key] + ele[1];
                            }
                        } else if(toString.call(target[key]).slice(8, -1) === 'Object') {             
                            recursion(target[key])
                        }

                    }
                }
                recursion(person);
            })

            actions.update_person(person)
        }

        if (data.action === 'DROP' && count > 0 ) {
            console.log('你丢弃这个物品了')
        }

       
    }

    abstractRef(r) {
        this.abs = r;
    }

    getAbstractPosition(x = 0, y = 0) {
        const menuStyles = {
            top: y,
            left: x
        };

        if (!this.abs) return menuStyles;

        const { innerWidth, innerHeight } = window;
        const rect = this.abs.getBoundingClientRect();

        if (y + rect.height > innerHeight) {
            menuStyles.top -= rect.height;
        }

        if (x + rect.width > innerWidth) {
            menuStyles.left -= rect.width;
        }

        if (menuStyles.top < 0) {
            menuStyles.top = rect.height < innerHeight ? (innerHeight - rect.height) / 2 : 0;
        }

        if (menuStyles.left < 0) {
            menuStyles.left = rect.width < innerWidth ? (innerWidth - rect.width) / 2 : 0;
        }

        return menuStyles;
    }

    // 使用事件防抖来实现该功能
    handleItemDetail = (e) => {
        const self = this;
        //可以调整位置
        self.abs.style.display = 'flex';
        self.abs.style.left = e.clientX+'px';
        self.abs.style.top = e.clientY+'px';
        //console.log(e.clientX+'px' + ':' + e.clientY+'px');
    }

    // 事件防抖
    debounce = (fn, delay) => {
        var delay = delay || 1000;
        var that = this;
        return function(){
             var args = arguments;
             if(that.timer){
                 clearTimeout(that.timer); 
             }
             const pram = {
                 clientX: args[0].nativeEvent.clientX,
                 clientY: args[0].nativeEvent.clientY
             }
             that.timer = setTimeout(function(){
                 that.timer = null;
                  fn.call(that,pram); 
             },delay)
        } 
    }

    handleItemDetailFade = () => {
        this.abs.style.display = 'none';
        this.timer?clearTimeout(this.timer):null;
    }

    render() {
        const {count, item, cb, id, extraOp} = this.props;
        const attributes = {
            'data-count': count,
            className: 'menu_action'
        };
        const {isVisible} = this.state
        const self = this;
        // onMouseLeave={this.handleItemDetailFade.bind(this)} onMouseOver={this.handleItemDetail.bind(this)}
        return (
            <div className="context-menu">
                <div>
                    <ContextMenuTrigger
                        id={id} name={item.name}
                        holdToDisplay={1000}
                        collect={collect} attributes={attributes}>
                        <div style={itemStyle.outerStyle}>
                            <img onClick={cb} onMouseLeave={this.handleItemDetailFade} onMouseMove={this.debounce(this.handleItemDetail)}  src={item.icon || 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1519471427785&di=e70781b51434dba6673f4191716104c3&imgtype=0&src=http%3A%2F%2Fpic35.photophoto.cn%2F20150601%2F0005018349076194_b.png'} alt="item pic"/>
                            <div className="item-info" style={isVisible? {...itemStyle.abstractStyle, display: 'flex'} :itemStyle.abstractStyle} ref={this.abstractRef.bind(this)}>
                                <span>{item.name}</span>
                                <span>{item.description}</span>
                            </div>
                            <span className="item-count">{'X '+count}</span>
                        </div>
                    </ContextMenuTrigger>
                </div>
 
                <ContextMenu id={id}>
                    <MenuItem onClick={this.handleClick.bind(this)} data={{ action: 'USE', item: item }}>使用</MenuItem>
                    {extraOp.length?extraOp.map((op, index) => {
                        return (           
                            <MenuItem key={index} onClick={op.cb.bind(self, item)} >{op.action_name}</MenuItem>
                        )
                    }): null}
                    <MenuItem onClick={this.handleClick.bind(this)} data={{ action: 'DROP', item: item }}>丢弃</MenuItem>
                </ContextMenu>
            </div>
        );
    }
}

ItemContextMenu.defaultProps = {
    id: 'unique_identifier',
    count: 0,
    item: {},           //组件填充内容
    cb: function(){},    //传入点击组件回调函数
    extraOp: []
};

ItemContextMenu.propTypes = {
    id: PropTypes.string,
    item: PropTypes.object,
    count: PropTypes.number,
    cb: PropTypes.func,
    extraOp: PropTypes.arrayOf(PropTypes.shape({    // 自定义操作
        action: PropTypes.string,
        action_name: PropTypes.string,
        cb: PropTypes.func
    }))
};

function mapStateToProps(state) {
    return {
        person: state.person
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({update_person}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemContextMenu)