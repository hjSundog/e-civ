import React from 'react'
// import api from '../../api';
import { connect } from 'react-redux'

import Mailcard from '../Common/Mailcard'
import PublishModal from '../Common/PublishModal'
import DeleteModal from '../Common/DeleteModal'

import './index.less'

import { getLetters } from '@/api/letter'



const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}
@connect(mapStateToProps)
export default class MailboxPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            publishModalVisible: false,
            deleteModalVisible: false,
            operatingMail: null          // 当前正在操作的mail对象
        }
    }
    componentDidMount () {
        getLetters().then(res => {
            debugger
        })
    }
    showPublishModal = () => {
        this.setState({
            publishModalVisible: true
        })
    }
    handleReply = (mail) => {
        this.setState({
            publishModalVisible: true,
            operatingMail: mail
        })
    }
    handleDelete = (mail) => {
        this.setState({
            deleteModalVisible: true,
            operatingMail: mail
        })
    }
    handleCancelModal = () => {
        this.setState({
            publishModalVisible: false,
            deleteModalVisible: false,
            operatingMail: null
        })
    }
    render() {
        const { publishModalVisible, deleteModalVisible, operatingMail } = this.state;
        return (
            <div className="wrapper">
                <div className="mailbox-content">
                    <header>
                        <span>最近联系</span>
                        <button id="create-conversation"
                            className="e-civ blue"
                            onClick={this.showPublishModal}>写私信</button>
                    </header>
                    <div className="mailbox-conversations">
                        <Mailcard
                            mail={{
                                id: "asdioq-a131",
                                from: {
                                    name: "梁王",
                                    img_url: "http://lwio.me/resume/img/head.jpg",
                                    id: "liangwang",
                                    icon: "administrator",
                                    icon_tip: "这是创世者之一的梁王"
                                },
                                to: {
                                    name: "admin",
                                    img_url: "",
                                    id: "keke"
                                },
                                content: "玩蛇TV，之后变富文本编辑器"
                            }}
                            onReply={this.handleReply}
                            onDelete={this.handleDelete}
                        >
                        </Mailcard>
                    </div>
                </div>
                <aside className="mailbox-aside">
                    <div className="mailbox-message">
                        担心骚扰？可以 <a href="/settings/notification">设置</a> 为「开启陌生人私信箱」。
                    </div>
                </aside>
                <PublishModal visible={publishModalVisible} mail={operatingMail} onCancel={this.handleCancelModal}></PublishModal>
                <DeleteModal visible={deleteModalVisible} mail={operatingMail} onCancel={this.handleCancelModal}></DeleteModal>
            </div>
        );
    }
}
