import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Output from './components/Output';
import { store, history } from './redux/store';
import { firestoreProps } from './redux/api';
import { ReduxFirestoreProvider } from 'react-redux-firebase';
import { CookiesProvider } from 'react-cookie';
import 'antd/dist/antd.css';
import './assets/scss/index.scss';

render(
    <Provider store={store}>
        <ReduxFirestoreProvider {...firestoreProps}>
            <CookiesProvider>
                <Output history={history} />
            </CookiesProvider>
        </ReduxFirestoreProvider>
    </Provider>,
    document.getElementById('root')
);
