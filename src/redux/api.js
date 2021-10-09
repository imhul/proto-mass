import { store } from './store';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { createFirestoreInstance } from 'redux-firestore';

const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true,
    logErrors: false,
};

const credentials = {
    email: process.env.REACT_APP_USER_EMAIL,
    pass: process.env.REACT_APP_USER_PASS
};

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
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

export const firestoreProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance
};
