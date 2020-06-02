
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import timerMiddleware from 'redux-timer-middleware';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { createFirestoreInstance } from 'redux-firestore';
import rootReducer from '../redux';

const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true,
    logErrors: false,
};

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

// const credentials = {
//   token: process.env.REACT_APP_USER_TOKEN,
//   profile: { email: process.env.REACT_APP_USER_EMAIL }
// };

const credentials = {
    email: process.env.REACT_APP_USER_EMAIL,
    pass: process.env.REACT_APP_USER_PASS
};

firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();

firebase.auth().onAuthStateChanged(async user => {
    if (!user) {
        await firebase.auth()
            .signInWithEmailAndPassword(credentials.email, credentials.pass)
            .then(data => console.info('data: ', data)) // signInAnonymously();
    }
});

export const history = createBrowserHistory();

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [
    thunk,
    routerMiddleware(history),
    timerMiddleware,
    logger
];

export const store = createStore(
    rootReducer(history),
    composeEnhancer(
        applyMiddleware(...middleware),
    ),
);

export const firestoreProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance
};
