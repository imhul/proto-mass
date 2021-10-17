import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router';
import { Redirect } from 'react-router-dom';

// Selectors
import { isAuthenticatedSelector } from '../../selectors/auth';

// Components
import Notify from '../Output/Notify';

const AuthContainer = ({ children, ...rest }) => {
    const isAuthenticated = useSelector(isAuthenticatedSelector);

    useEffect(() => {
        if (!isAuthenticated)
            Notify({
                type: 'warn',
                message: 'You are not logged in',
                description: 'To play the game, you must first authenticate!',
                icon: 'warning',
                duration: 4
            });
    }, [isAuthenticated]);

    return (
        <Route
            {...rest}
            render={({ location }) =>
                isAuthenticated ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
};

export default AuthContainer;
