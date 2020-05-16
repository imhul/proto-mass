import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Output from './components/Output';
import { store, history, firestoreProps } from './redux/store';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import { CookiesProvider } from 'react-cookie';
import "antd/dist/antd.css";
import "./assets/scss/index.scss";

render(
  <Provider store={ store }>
    <ReactReduxFirebaseProvider {...firestoreProps}>
      <CookiesProvider>
        <Output history={ history } />
      </CookiesProvider>
      </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById('root'),
);
