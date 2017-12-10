import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Input, Form, Automplete } from 'antd'
import Iconfont from '@/components/Iconfont'
import './index.less'

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
        console.log(nextProps)
        this.setState({
            visible: nextProps.visible || this.state.visible
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
            visible: false,
            publishLoading: false,
            autocompleteSource: ["asdasd","bsad","443474713@qq.com"]
        })
        this.props.onCancel && this.props.onCancel();
    }

    onSelect = (value) => {
        console.log('onSelect', value);
    }
    render() {
        const { visible, publishLoading, autocompleteSource } = this.state
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
                        <Input placeholder="填写对方的用户名" />
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
    onCancel: PropTypes.func,
    onAfterSubmit: PropTypes.func
}

PublishModal.defaultProps = {
    onCancel: () => {}
};
