import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, matchPath } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Layout, Progress, Row, Col, Badge, Avatar, Card } from 'antd'
import * as PersonActionCreators from '@/actions/person'
import RadarChart from './RadarChart'

const { Meta, Grid } = Card;
import './index.less'

const { Sider } = Layout;

const isActive = (path, history) => {
    return matchPath(path, {
        path: history.location.pathname,
        exact: true,
        strict: false
    })
}

const attributeMap = {
    str: '力量',
    dex: '敏捷',
    con: '体质',
    int: '智力',
    wis: '智慧',
    cha: '魅力'
}


const gridStyle = {
    width: '50%',
    textAlign: 'center',
    padding: '20px 15px'
}

const bodyStyle = {
    padding: '0px'
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

  }

  componentWillReceiveProps(nextProps) {
      Array.isArray(nextProps.items) && nextProps.items.map((item) => {
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

  createStateBar = (state, key, percent) => {
      if (!percent) {
          percent = key;
          key = state;
      }
      return (<div key={key} className="state_bar"><span>{state}</span><Progress showInfo={false} percent={percent} /></div>);
  }


  createAttributeBar = (state, key, number) => {
      if (!number) {
          number = key;
          key = state;
      }
      return (<div key={key} className="state_bar"><span>{state}</span><Progress showInfo={false} percent={percent} /></div>);
  }

  render () {
      const charactor = this.props.person
      let attributeData = [];
      let statesItems = []
      let attributeItems = []
      if (charactor.conditions && charactor.attributes) {
          const {health, maxHealth, stamina, maxStamina} = charactor.conditions;
          const healthPercent = (health / maxHealth) * 100;
          const staminaPercent = (stamina / maxStamina) * 100;


          statesItems.push(this.createStateBar('生命值', 'health', healthPercent));
          statesItems.push(this.createStateBar('耐力值',  'stamina', staminaPercent));

          attributeItems = Object.entries(charactor.attributes).map(attribute => {
              // 属性map
              const data = [attributeMap[attribute[0]], attribute[1]];
              attributeData.push(data);
              // 视图
              return <Grid key={attribute[0]} style={gridStyle}><div className="Attribute_Card"><span>{data[0]+':'}</span><span>{data[1]}</span></div></Grid>
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
                          //   actions={[<Icon type="up" key={1} onClick={that.handleHealthUp.bind(that)}/>, <Icon key={2} type="down" onClick={that.handleHealthDown.bind(that)}/>, <Icon type="reload" key={3} onClick={that.handleHealthReload.bind(that)}/>]}
                      >
                          <Meta
                              avatar={<Badge count={1}><Avatar src={charactor.avatar} /></Badge>}
                              title={charactor.nickname}
                              description={charactor.description}
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
                          <RadarChart 
                              width={150} 
                              extraDemensionName='其他'
                              maxDemensionInfo
                              data={attributeData}
                          />
                          <Card bodyStyle={bodyStyle}>
                              {attributeItems}
                          </Card>
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
        id: null,
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
