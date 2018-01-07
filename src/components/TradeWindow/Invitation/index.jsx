import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'
import Iconfont from '@/components/Iconfont';
import {Card, message, Table, Button, Menu} from 'antd';
import './index.less'

const SubMenu =  Menu.SubMenu;

// 分页
const pagination = {
    total: 0,
    showSizeChanger: false,
    pageSize: 3,
    onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize);
    },
    onChange(current) {
        console.log('Current: ', current);
    },
};

class Invitation extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            filteredInfo: null,
            sortedInfo: null,
            selectedRowKeys: [],  // 这里配置默认勾选列
            loading: false,
        }
    }
    // start = () => {
    //     this.setState({ loading: true });
    //     // 模拟 ajax 请求，完成后清空
    //     setTimeout(() => {
    //         this.setState({
    //             selectedRowKeys: [],
    //             loading: false,
    //         });
    //     }, 1000);
    // }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    handleChange = (pagination, filters, sorter) => {
        //console.log('各类参数是', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    }

    clearFilters(e) {
        e.preventDefault();
        this.setState({ filteredInfo: null });
    }

    clearAll(e) {
        e.preventDefault();
        this.setState({
            filteredInfo: null,
            sortedInfo: null,
        });
    }

    setLevelSort(e) {
        e.preventDefault();
        this.setState({
            sortedInfo: {
                order: 'descend',
                columnKey: 'level',
            },
        });
    }

    handleOperationTrue = (text, record) => () => {
        //为啥text 和 record 是相同的？？
        this.props.onReceive(record.key)
    }

    handleOperationFalse = (text, record) => () => {
        this.props.onRefuse(record.key);
    }

    handleOperations = (e) => {
        const {onRefuse, onRefuseAll} = this.props;
        switch(e.key) {
        case 'refuse-all':
            onRefuseAll();
            break;
        case 'refuse-page':
            //onRefuse
            break;
        case 'refuse-select':
            this.state.selectedRowKeys.forEach(key => {
                onRefuse(key);
            })
            break;
        default:
            return;
        }
    }
    // 关闭窗口
    handleClose = () => {
        this.props.onClose();
    }

    render() {
        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const self = this;
        const columns = [{
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a href="#">{text}</a>,
        }, {
            title: '等级',
            dataIndex: 'level',
            key: 'level',
            sorter: (a, b) => a.level - b.level,
            sortOrder: sortedInfo.columnKey === 'level' && sortedInfo.order
        }, {
            title: '操作',
            key: 'operation',
            className: 'col-operation',
            render: (text, record) => (
                <span>
                    <a href="#" onClick={this.handleOperationTrue(text, record)}><Iconfont type="recieve"></Iconfont></a>
                    <span className="ant-divider"></span>
                    <a href="#" onClick={this.handleOperationFalse(text, record)}><Iconfont type="refuse"></Iconfont></a>
                    <span className="ant-divider"></span>
                </span>
            ),
        }];

        const { loading, selectedRowKeys } = this.state;

        const rowSelection = {
            onChange(selectedRowKeys, selectedRows) {
                self.onSelectChange(selectedRowKeys);
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect(record, selected, selectedRows) {
                //console.log('hhd')
                console.log(record, selected, selectedRows);
            },
            onSelectAll(selected, selectedRows, changeRows) {
                console.log(selected, selectedRows, changeRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'mdzz',    // 配置无法勾选的列
            }),
            selectedRowKeys,
        };
        const hasSelected = selectedRowKeys.length > 0;


        const {trasactions, visible} = this.props;
        const data = trasactions.map((trasaction, index) => {
            return {
                key: index,
                name: trasaction.name,
                level: trasaction.level,
            }
        })
        return (
            <Draggable        
                axis="both"
                defaultPosition={{x: -200, y: -0}}
                grid={[5, 5]}
                onStart={()=>{}}
                onDrag={()=>{}}
                onStop={()=>{}}>
                <div className="Invitation" style={{display: visible?'block':'none'}}>
                    <Card title="邀请交易" extra={<a onClick={this.handleClose}><Iconfont type="close"></Iconfont></a>}>
                        <div className="row-operation">
                            <Button type="primary" disabled={!hasSelected} loading={loading}
                            >
                                <Menu onClick={this.handleOperations}>
                                    <SubMenu title={'操作'}>
                                        <Menu.Item key="refuse-all">拒绝全部</Menu.Item>
                                        <Menu.Item key="refuse-page">拒绝本页</Menu.Item>
                                        <Menu.Item key="refuse-select">拒绝所选</Menu.Item>
                                    </SubMenu>
                                </Menu>
                            </Button>
                            <span style={{ marginLeft: 8 }}>{hasSelected ? `选择了 ${selectedRowKeys.length} 个对象` : ''}</span>
                        </div>
                        <Table onChange={this.handleChange} pagination={{...pagination, ...{total: data.length}}} rowSelection={rowSelection} columns={columns} dataSource={data} />
                        <div className="invitation_foot">底部</div>
                    </Card>   
                </div>
            </Draggable>
        );
    }
}


Invitation.defaultProps = {
    visible: false,
    trasactions: [],
    onReceive: () => {},
    onRefuse: () => {},
    onRefuseAll: () => {},
    onTradeOver: () => {}
};

Invitation.propTypes = {
    visible: PropTypes.bool,
    onRefuse: PropTypes.func,
    onRefuseAll: PropTypes.func,
    onReceive: PropTypes.func,
    onTradeOver: PropTypes.func,
    trasactions: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        level: PropTypes.number
    }))
};

export default Invitation;
