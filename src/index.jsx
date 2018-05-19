import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import store from './store';

import Root from './containers/Root';

import 'normalize.css';
import './style/index.less'



render(
    <AppContainer>
        <Root
            store={ store }
        />
    </AppContainer>,
    document.getElementById('root')
);

if (module.hot) {
    module.hot.accept('./containers/Root', () => {
        const RootContainer = require('./containers/Root').default;
        render(
            <AppContainer warnings={false}>
                <RootContainer
                    store={ store }
                />
            </AppContainer>,
            document.getElementById('root')
        );
    });
}
