import React from 'react'
// import api from '../../api';

import Mailcard from '../Common/Mailcard'
import PublishModal from '../Common/PublishModal'

import './index.less'

export default class MailboxPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            publishModalVisible: false
        }
    }
    showPublishModal = () => {
        this.setState({
            publishModalVisible: true
        })
    }
    render() {
        const { publishModalVisible } = this.state;
        return (
            <div className="wrapper">
                <div className="mailbox-content">
                    <header>
                        <span>最近联系</span>
                        <button id="create-conversation"
                            className="e-civ blue"
                            onClick={this.showPublishModal}>写私信</button>
                        <PublishModal visible={publishModalVisible}></PublishModal>
                    </header>
                    <div className="mailbox-conversations">
                        <Mailcard mail={{
                            from: {
                                name: "梁王",
                                img_url: "http://lwio.me/resume/img/head.jpg",
                                person_id: "keke",
                                icon: "administrator",
                                icon_tip: "这是创世者之一的梁王"
                            },
                            content: "玩蛇TV，之后变富文本编辑器"
                        }}
                        >
                        </Mailcard>
                    </div>
                </div>
                <aside className="mailbox-aside">
                    <div className="mailbox-message">
                        担心骚扰？可以 <a href="/settings/notification">设置</a> 为「开启陌生人私信箱」。
                    </div>
                </aside>
            </div>
        );
    }
}
