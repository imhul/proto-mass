import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Output from './components/Output';
import { store, history, } from './redux/store';
import API, { ApiProvider } from './utils/api';
import { CookiesProvider } from 'react-cookie';
import "antd/dist/antd.css";
import "./assets/scss/index.scss";

render(
  <Provider store={ store }>
    <ApiProvider value={new API()}>
      <CookiesProvider>
        <Output history={ history } />
      </CookiesProvider>
    </ApiProvider>
  </Provider>,
  document.getElementById('root'),
);
