import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Input, Form, Automplete } from 'antd'
import Iconfont from '@/components/Iconfont'
import './index.less'

import { postLetters } from '@/api/letter'

class RegistrationForm extends React.Component {
    render() {
        const { mail, form } = this.props
        const { getFieldDecorator } = form;
        return <Form>
            <Form.Item>
                {getFieldDecorator('toUserId', {
                    initialValue: '',
                })(
                    <Input placeholder="填写对方的用户id(考虑输入用户名并优化autocomplete)" disabled={mail && Boolean(mail.to.id)} />
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('content', {
                    initialValue: '',
                })(
                    <Input.TextArea placeholder="填写私信内容" autosize={{ minRows: 2, maxRows: 6 }} />
                )}
            </Form.Item>
        </Form>
    }

}
const WrappedNewLetterForm = Form.create()(RegistrationForm);

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
    handleCancel = () => {
        this.setState({
            publishLoading: false,
        })
        this.props.onCancel && this.props.onCancel();
    }
    saveFormRef = (el) => {
        this.formRef = el;
    }
    handleSubmit = () => {
        postLetters({
            title: '默认标题',
            content: this.formRef.props.form.getFieldValue('content'),
            toUserId: '5ab89a49e98e131c9180c020'
        }).then(({data}) => {
            this.props.onAfterSubmit();
        })
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
                <WrappedNewLetterForm mail={mail} wrappedComponentRef={(this.saveFormRef)} />
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
    onCancel: () => {},
    onAfterSubmit: () => {}
};

