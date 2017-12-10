import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button} from 'antd'
import Iconfont from '@/components/Iconfont'
import './index.less'

// TODO: 考虑把form移出来成一个单独组件
export default class PublishModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            deleteLoading: false,
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible
        })
    }
    handleDelete = (mail) => {
        console.log(`delete mail id ${mail.id}`)
        // 如果成功了
        setTimeout(() => {
            this.props.onAfterDelete();
            this.props.onCancel();
        }, 3000)
    }
    handleCancel = () => {
        this.setState({
            deleteLoading: false,
        })
        this.props.onCancel && this.props.onCancel();
    }

    onSelect = (value) => {
        console.log('onSelect', value);
    }
    render() {
        const { visible, deleteLoading } = this.state
        const { mail } = this.props
        return (
            <Modal
                visible={visible}
                title="写私信"
                onCancel={this.handleCancel}
                footer={[
                    <Button key="submit" type="primary" loading={deleteLoading} onClick={this.handleDelete.bind(mail)}>
                        确定删除
                    </Button>,
                    <Button key="cancel" onClick={this.handleCancel}>
                        取消
                    </Button>
                ]}
            >
            </Modal>
        );
    }
}

PublishModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    mail: PropTypes.shape({
        id: PropTypes.string.isRequired
    }),
    onCancel: PropTypes.func,
    onAfterDelete: PropTypes.func,
}

PublishModal.defaultProps = {
    onCancel: () => {},
    onAfterDelete: () => {}
};
