import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';

import promiseMiddleware from '../middlewares/promiseMiddleware'
import persistState from './persistStateEnhancer'

import reducer from '../reducers';

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    promiseMiddleware({promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'ERROR']})
)(createStore);

export default function configureStore(initialState) {
    let store;

    if (process.env.NODE_ENV === 'development') {
        const DevTools = require('../containers/DevTools').default;

        const enhancer = compose(
            DevTools.instrument(),
            persistState([], {}),
        );
        store = createStoreWithMiddleware(reducer, initialState, enhancer);

        if (module.hot) {
            module.hot.accept('../reducers', () =>
                store.replaceReducer(require('../reducers').default)
            );
        }
    }else{
        const enhancer = compose(
            persistState([], {}),
        )
        store = createStoreWithMiddleware(reducer, initialState, enhancer);
    }

    return store;
}
