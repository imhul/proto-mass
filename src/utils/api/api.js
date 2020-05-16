import app from 'firebase/app';
import 'firebase/auth';
// import firebase from 'firebase';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class API {
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.firestore = app.firestore();

        // const users = firebase.firestore().collection('users');
        // console.info('firebase users: ', users);
    }

    users = () => this.firestore.ref('users');
};

export default API;
