import React from 'react';
import API from './api';

const FirebaseContext = React.createContext(null);
const ApiConsumer = FirebaseContext.Consumer;
export const ApiProvider = FirebaseContext.Provider;
export const withFirebase = Component => props => (
    <ApiConsumer>
        {firebase => <Component {...props} firebase={firebase} />}
    </ApiConsumer>
);

export default API;
 