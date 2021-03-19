import React, {useState, useEffect} from 'react';
import {
  BrowserRouter as Router, 
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import { Layout } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

export default function ApplicationRoutes() {
  const [collapse, setCollapse] = useState(false);
  useEffect(() => {
    window.innerWidth <= 760 ? setCollapse(true) : setCollapse(false);
  }, []);

  const handleToggle = (event) => {
    event.preventDefault();
    collapse ? setCollapse(false) : setCollapse(true);
  }

  return (
    <Router>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapse}>

        </Sider>
        <Layout>
          <Header className="siteLayoutBackground" style={{}}>
            {
              React.createElement(collapse ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: handleToggle,
                style: {color: '#fff'}
              })
            }
          </Header>
          <Content style={{}}>
            <Switch>

            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Router>
  )
}
