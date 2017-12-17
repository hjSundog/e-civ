import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, matchPath } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import api from '../../api'
import { Layout, Menu, Icon, Progress, Row, Col, Badge, Dropdown, Avatar, Popover, Card } from 'antd'
import { Link } from 'react-router-dom'
import * as PersonActionCreators from '@/actions/person'

const SubMenu = Menu.SubMenu
const { Meta } = Card;
import './index.less'

const { Sider } = Layout;

const isActive = (path, history) => {
    return matchPath(path, {
        path: history.location.pathname,
        exact: true,
        strict: false
    })
}

class Sidebar extends React.Component {

  state = {
      openKey: "sub1",
      activeKey: "menu101",
      collapsed: false,
      mode: 'inline',
      person: {
          ...this.props.person
      }
  }

  toggle = () => {
      this.setState({
          collapsed: !this.state.collapsed,
          mode: !this.state.collapsed ? 'vertical' : 'inline',
      });
  }

  componentDidMount () {
      // api({
      //     url: '/persons/2233',
      //     method: 'get'
      // }).then(res => {
      //     // this.setState({
      //     //     loading: false
      //     // });
      //     if (res.status !== 200) {
      //         console.log('获取人物信息失败')
      //     }
      //     if (res.status === 200)  {
      //         this.setState({
      //             person: Object.assign({},this.state.person,res.data)
      //         })
      //     }
      // }).catch(err => {
      //     this.setState({update_person
      //         loading: false
      //     });
      //     throw new Error(err)
      // })
  }

  componentWillReceiveProps(nextProps) {
      Array.isArray(nextProps.items) && nextProps.items.map((item, i) => {
          Array.isArray(item.child) && item.child.map((node) => {
              if(node.url && isActive(node.url, this.props.history)){
                  this.menuClickHandle({
                      key: 'menu'+node.key,
                      keyPath: ['menu'+node.key, 'sub'+item.key]
                  })
              }
          })
      });
  }


  menuClickHandle = (item) => {
      this.setState({
          activeKey: item.key
      })
  }
  handleHealthReload() {
      this.props.actions.reset()
  }
  handleHealthUp() {
      this.props.actions.update_person({
          health: this.props.person.conditions.health+10
      })
  }

  handleHealthDown() {
      this.props.actions.update_person({
          health: this.props.person.conditions.health-10
      })
  }
  render () {
      const that = this
      const charactor = this.props.person
      let statesItems = ''
      let attributeItems = ''
      if (charactor.conditions && charactor.attributes) {
          statesItems = Object.entries(charactor.conditions).map(condition => {
              return <div key={condition[0]}><span>{condition[0]}</span><Progress showInfo={false} percent={condition[1]}/></div>
          })
          attributeItems = Object.entries(charactor.attributes).map(attribute => {
              return <div key={attribute[0]}><span>{attribute[0]}</span><span>{attribute[1]}</span></div>
          }) 
      }
      return (
          <Sider
              trigger={null}
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
              style={{background: 'white'}}
          >
              <Row>
                  <Col>
                      <Card
                          cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                          actions={[<Icon type="up" key={1} onClick={that.handleHealthUp.bind(that)}/>, <Icon key={2} type="down" onClick={that.handleHealthDown.bind(that)}/>, <Icon type="reload" key={3} onClick={that.handleHealthReload.bind(that)}/>]}
                      >
                          <Meta
                              avatar={<Badge count={1}><Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /></Badge>}
                              title={charactor.name}
                              description={charactor.des}
                          />
                      </Card>
                  </Col>
              </Row>
              <Row>
                  <Col>
                      <Card title="我的状态" bordered={false}>
                          {statesItems}
                      </Card>
                  </Col>
              </Row>
              <Row>
                  <Col>
                      <Card title="我的属性" bordered={false}>
                          {attributeItems}
                      </Card>
                  </Col>
              </Row>
          </Sider>
      )
  }
}

Sidebar.defaultProps = {
    person: {
        name: '',
        person_id: null,
        attributes: {
            str: 1,
            dex: 1,
            con: 1,
            int: 1,
            wis: 1,
            cha: 1
        },
        items: [],
        des: '',
        conditions: {
            health: 100,
            maxHealth: 100,
            stamina: 100,
            maxStamina: 100
        },
        status: [],
        meta: {
            age: 0,
            sex: 'male'
        }
    }
}

Sidebar.propTypes = {
    person: PropTypes.object,
    actions: PropTypes.object
}


function mapStateToProps(state) {

    return {
        person: state.person
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(PersonActionCreators, dispatch) 
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Sidebar))
