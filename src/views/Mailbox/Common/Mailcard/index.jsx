import React from 'react'
import PropTypes from 'prop-types'
import {Tooltip} from 'antd'
import Iconfont from '@/components/Iconfont'
import './index.less'

export default class Mailcard extends React.Component {
    render() {
        const { from, content } = this.props.mail
        return (
            <div className="mailcard">
                <a className="mailcard-avatar link-avatar50">
                    <img className="img-avatar50" src={from.img_url} />
                </a>
                <div className="mailcard-main">
                    <header>
                        <a className="mailcard-from">{from.name}</a>
                        <Tooltip placement="top" title={from.icon_tip}>
                            <Iconfont type={from.icon}></Iconfont>
                        </Tooltip>
                    </header>
                    <div className="mailcard-content">
                        {content}
                    </div>
                    <footer className="mailcard-meta">
                        <time>10月25日 17:33</time>
                        <div className="operations">
                            <a name="inspect">查看对话</a>
                            <a name="reply">回复</a>
                            <a name="delete">删除</a>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }
}

Mailcard.propTypes = {
    mail: PropTypes.shape({
        from: PropTypes.shape({
            name: PropTypes.string.isRequired,
            img_url: PropTypes.string,
            person_id: PropTypes.string,
            icon: PropTypes.string,
            icon_tip: PropTypes.string,
        }),
        content: PropTypes.string.isRequired
    })
}
