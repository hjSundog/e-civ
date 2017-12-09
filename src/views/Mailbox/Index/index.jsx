import React from 'react'
// import api from '../../api';

import Mailcard from '../Common/Mail'

import './index.less'

export default class MailboxPage extends React.Component {
    render() {
        return (
            <div className="wrapper">
                <div className="mailbox-content">
                    <header>
                        <span>最近联系</span>
                        <button id="create-conversation" className="e-civ blue">写私信</button>
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
