import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Input, Form, Automplete } from 'antd'
import Iconfont from '@/components/Iconfont'
import './index.less'

import { getLetter, getLetters, postLetters } from '@/api/letter'
// TODO: 考虑把form移出来成一个单独组件
export default class PublishModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            publishLoading: false,
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible
        })
    }
    handleSubmit = () => {
        // 如果成功了
        setTimeout(() => {
            this.props.onAfterSubmit();
        }, 3000)
    }
    handleCancel = () => {
        this.setState({
            publishLoading: false,
        })
        this.props.onCancel && this.props.onCancel();
    }

    onSelect = (value) => {
        console.log('onSelect', value);
    }
    render() {
        const { visible, publishLoading } = this.state
        const { mail } = this.props
        return (
            <Modal
                visible={visible}
                title="写私信"
                onCancel={this.handleCancel}
                footer={[
                    <Button key="submit" type="primary" loading={publishLoading} onClick={this.handleSubmit}>
                        发出私信
                    </Button>,
                ]}
            >
                <Form>
                    <Form.Item>
                        <Input placeholder="填写对方的用户名" disabled={mail && Boolean(mail.to.id)} />
                    </Form.Item>
                    <Form.Item>
                        <Input.TextArea placeholder="填写私信内容" autosize={{ minRows: 2, maxRows: 6 }} />
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

PublishModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    mail: PropTypes.shape({
        from: PropTypes.shape({
            name: PropTypes.string.isRequired,
            img_url: PropTypes.string,
            person_id: PropTypes.string,
            icon: PropTypes.string,
            icon_tip: PropTypes.string,
        }),
        content: PropTypes.string.isRequired
    }),
    onCancel: PropTypes.func,
    onAfterSubmit: PropTypes.func,
}

PublishModal.defaultProps = {
    onCancel: () => {}
};
