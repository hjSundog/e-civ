
import React from 'react';
import { Route, Switch,Redirect } from 'react-router-dom';
import authHOC from '@/utils/auth'

import Home from '@/views/Home';
import Form from '@/views/Form';
import Table from '@/views/Table';
import Calendar from '@/views/Calendar';
import Timeline from '@/views/Timeline';
import Steps from '@/views/Steps';
import Cards from '@/views/Cards';

import Mailbox from '@/views/Mailbox/Index';
import MailboxConversation from '@/views/Mailbox/Detail';

import Skill from '@/views/Skill/Index';

import Page2 from '@/views/Page2';
import Donation from '@/views/Donation';


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
        'path': '/skill',
        'component': Skill
    },
    {
        'path':'/page2',
        'component': Page2
    },
    {
        'path': '/donation',
        'component': Donation
    },
];

// "/"目录下路由
const routes = (
    <Switch>
        <Route exact strict path="/">
            <Redirect to="/home"/>
        </Route>
        {childRoutes.map((route, index) => (
            <Route key={index} path={route.path} component={authHOC(route.component)} exactly={route.exactly} />
        ))}
    </Switch>
);

export default routes
