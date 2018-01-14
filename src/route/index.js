import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from '../views/Layout';
import Login from '../views/Login';
import Signup from '../views/Signup';
import authHOC from '@/utils/auth'

import WebsocketTest from '@/views/WebsocketTest'
import Charactor from '@/views/Charactor';

const routes = (
    <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/websocket" component={WebsocketTest} />
        <Route path="/charactor" component={Charactor} />
        <Route path="/" component={authHOC(Layout)}/>
    </Switch>
);

export default routes
