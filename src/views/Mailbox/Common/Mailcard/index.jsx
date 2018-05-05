import React from 'react'
import PropTypes from 'prop-types'
import {Tooltip} from 'antd'
import Iconfont from '@/components/Iconfont'
import './index.less'

export default class Mailcard extends React.Component {
    onReply = () => {
        this.props.onReply(this.props.mail)
    }
    onDelete = () => {
        this.props.onDelete(this.props.mail)
    }
    render() {
        const { mail } = this.props
        return (
            <div className="mailcard">
                <a className="mailcard-avatar link-avatar50">
                    <img className="img-avatar50" src={mail.from_user.avatar_url} />
                </a>
                <div className="mailcard-main">
                    <header>
                        <a className="mailcard-from">{mail.from_user.name}</a>
                        <Tooltip placement="top" title='这是创世者之一的梁王'>
                            <Iconfont type='administrator'></Iconfont>
                        </Tooltip>
                    </header>
                    <div className="mailcard-content">
                        {mail.content}
                    </div>
                    <footer className="mailcard-meta">
                        <time>10月25日 17:33</time>
                        <div className="operations">
                            <a name="inspect">查看对话</a>
                            <a onClick={this.onReply} name="reply">回复</a>
                            <a onClick={this.onDelete}  name="delete">删除</a>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }
}

Mailcard.propTypes = {
    onReply: PropTypes.func,
    onDelete: PropTypes.func,
    mail: PropTypes.shape({
        from_user: PropTypes.shape({
            name: PropTypes.string.isRequired,
            avatar_url: PropTypes.string,
            person_id: PropTypes.string,
            icon: PropTypes.string,
            icon_tip: PropTypes.string,
        }),
        content: PropTypes.string.isRequired
    })
}

Mailcard.defaultProps = {
    onReply: () => {},
    onDelete: () => {}
};
