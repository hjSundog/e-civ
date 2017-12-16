import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from '../views/Layout';
import Login from '../views/Login';
import Signup from '../views/Signup';

import WebsocketTest from '@/views/WebsocketTest'

const routes = (
    <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/websocket" component={WebsocketTest} />
        <Route path="/" component={Layout}/>
    </Switch>
);

export default routes
