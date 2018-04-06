import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Form, Input} from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import Iconfont from '@/components/Iconfont'
import './index.less'

// TODO: 自动截屏
class FeedbackModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            feedbackLoading: false,
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible
        })
    }
    handleFeedback = () => {
        console.log(`feedback send`)
        this.setState({
            feedbackLoading: true
        })
        // 如果成功了
        setTimeout(() => {
            this.props.onAfterFeedback();
            this.props.onCancel();
        }, 3000)
    }
    handleCancel = () => {
        this.setState({
            feedbackLoading: false,
        })
        this.props.onCancel && this.props.onCancel();
    }

    onSelect = (value) => {
        console.log('onSelect', value);
    }
    render() {
        const { visible, feedbackLoading } = this.state
        const { mail } = this.props
        return (
            <Modal
                visible={visible}
                title="写反馈"
                onCancel={this.handleCancel}
                footer={[
                    <Button key="submit" type="primary" loading={feedbackLoading} onClick={this.handleFeedback}>
                        反馈
                    </Button>,
                    <Button key="cancel" onClick={this.handleCancel}>
                        取消
                    </Button>
                ]}
            >
                {/* 后续加入自动截屏反馈 */}
                <Form>
                    <Form.Item>
                        <Input placeholder="反馈标题" disabled={mail && Boolean(mail.to.id)} />
                    </Form.Item>
                    <Form.Item>
                        <Input.TextArea placeholder="反馈内容" autosize={{ minRows: 2, maxRows: 6 }} />
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

FeedbackModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func,
    onAfterFeedback: PropTypes.func,
}

FeedbackModal.defaultProps = {
    onCancel: () => {},
    onAfterFeedback: () => {}
};

function mapStateToProps(state) {
    const {user} = state;
    return {
        user: user
    }
}

export default withRouter(connect(mapStateToProps)(FeedbackModal))
