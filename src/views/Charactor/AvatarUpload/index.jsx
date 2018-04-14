import React from 'react'
import PropTypes from 'prop-types'
import { message, Upload, Modal, Icon, Button } from 'antd'
//import Iconfont from '../../components/Iconfont';
import './index.less'

const types = "image/png,image/jpeg,image/gif,image/jpg".split(',');
export const  AvatarUrl = "data:image/gif;base64,R0lGODlhMwAxAIAAAAAAAP///yH5BAAAAAAALAAAAAAzADEAAAK8jI+pBr0PowytzotTtbm/DTqQ6C3hGXElcraA9jIr66ozVpM3nseUvYP1UEHF0FUUHkNJxhLZfEJNvol06tzwrgdLbXsFZYmSMPnHLB+zNJFbq15+SOf50+6rG7lKOjwV1ibGdhHYRVYVJ9Wnk2HWtLdIWMSH9lfyODZoZTb4xdnpxQSEF9oyOWIqp6gaI9pI1Qo7BijbFZkoaAtEeiiLeKn72xM7vMZofJy8zJys2UxsCT3kO229LH1tXAAAOw==";

class AvartarUpload extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            imageUrl: AvatarUrl,
            loading: false,
            previewVisible: false,
            previewImage: ''
        };
    }


    beforeUpload = (file) => {
        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
            message.error('You can only upload JPG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJPG && isLt2M;
    }

    handleCancel = () => this.setState({ previewVisible: false })


    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }


    handleReturn = (type, rt) => {
        switch (type) {
        case 'error':
            message.error(rt);
            return;
        case 'warning':
            message.warn(rt);
            return;
        default:
            return;
        }
    }

    componentDidMount() {
        const { maxSize, callback } = this.props;

        this.input.onclick = () => {
            this.setState({
                loading: true
            })
        };

        this.input.onchange = (e) => {
            const fileObj = e.target.files[0] || e.dataTransfer.files[0];
            if (fileObj) {
                if (fileObj.size > maxSize) {
                    this.handleReturn('error', '请传入大小小于' + (fileObj.size / 1024 / 1024) + 'M的图片');
                    return;
                }
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    this.setState({
                        imageUrl: reader.result,
                        loading: false,
                    });
                    callback(reader.result, reader);
                });
                reader.readAsDataURL(fileObj);

            }
            // this.handlePreview(fileObj);
            // this.handleChange({file: fileObj});
        }
    }

    handleUploadClick = (e) => {
        this.input.click();
    }

    render() {
        const { filter } = this.props;
        const { previewVisible, previewImage } = this.state;
        // 上传按钮
        const uploadButton = (
            <Button onClick={this.handleUploadClick}>
                <Icon type="upload" /> Click to Upload
            </Button>
        );

        const loadingButton = (
            <Button>
                上传中请等待..<Icon type="loading" />
            </Button>
        )
        const tps = types.filter((type) => {
            return type.indexOf(filter) === -1 ? true : false;
        })

        return (
            <div className="avatar_upload">
                <div className="clearfix">
                    <div className="img_holder">
                        <img src={this.state.imageUrl} alt="" />
                    </div>
                    <div>
                        <input ref={node => this.input = node} type="file" accept={tps.join(', ')} style={{ display: "none" }} />
                        {this.state.loading ? loadingButton : uploadButton}
                    </div>
                </div>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        )
    }
}

AvartarUpload.defaultProps = {
    callback: () => { },
    maxSize: 10485760, // 10M
    filter: ''
}

AvartarUpload.propTypes = {
    callback: PropTypes.func,
    maxSize: PropTypes.number,
    filter: PropTypes.string
}

export default AvartarUpload
