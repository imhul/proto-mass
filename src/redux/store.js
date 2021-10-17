import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import timerMiddleware from 'redux-timer-middleware';
import rootReducer from '../redux';

const logger = createLogger({
    // timestamp: false,
    diff: true,
    duration: true,
    collapsed: true
});

export const history = createBrowserHistory();

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [thunk, routerMiddleware(history), timerMiddleware, logger];

export const store = createStore(
    rootReducer(history),
    composeEnhancer(applyMiddleware(...middleware))
);
