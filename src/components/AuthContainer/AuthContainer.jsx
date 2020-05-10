import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router';
import { Redirect } from "react-router-dom";

// Components
import Notify from '../Output/Notify';

const AuthContainer = ({ children, ...rest }) => {

    const { isAuthenticated } = useSelector(state => state.auth);

    useEffect(() => {
        if (!isAuthenticated) Notify({
            type: "warn",
            message: "You are not logged in",
            description: "To play the game, you must first authenticate! Or you can just return to the home page;)",
            icon: "warning",
            duration: 3
        })
    }, [isAuthenticated]);

    return <Route {...rest}
        render={({ location }) => isAuthenticated ? children :
            <Redirect to={{
                pathname: "/login",
                state: { from: location }
            }} />
        }
    />;
}

export default AuthContainer;
