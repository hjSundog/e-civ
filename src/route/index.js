import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from '../views/Layout';
import Login from '../views/Login';
import Signup from '../views/Signup';

import Home from '@/views/Home';
import Form from '@/views/Form';
import Table from '@/views/Table';
import Calendar from '@/views/Calendar';
import Timeline from '@/views/Timeline';
import Steps from '@/views/Steps';
import Cards from '@/views/Cards';

import Mailbox from '@/views/Mailbox/Index';
import MailboxConversation from '@/views/Mailbox/Detail';

import Page2 from '@/views/Page2';
import Donation from '@/views/Donation';

import WebsocketTest from '@/views/WebsocketTest'

export const childRoutes = [
    {
        'path':'/home',
        'component': Home,
        'exactly': true
    },
    {
        'path':'/form',
        'component': Form
    },
    {
        'path':'/table',
        'component': Table
    },
    {
        'path':'/calendar',
        'component': Calendar
    },
    {
        'path':'/timeline',
        'component': Timeline
    },
    {
        'path':'/steps',
        'component': Steps
    },
    {
        'path':'/cards',
        'component': Cards
    },
    {
        'path': '/mailbox/:personId',
        'component': MailboxConversation,
    },
    {
        'path':'/mailbox',
        'component': Mailbox
    },
    {
        'path':'/page2',
        'component': Page2
    },
    {
        'path': '/donation',
        'component': Donation
    }
];

const routes = (
    <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/websocket" component={WebsocketTest} />
        <Route path="/" component={Layout}/>
    </Switch>
);

export default routes
