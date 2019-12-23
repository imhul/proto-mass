import React from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router';
import { Redirect } from "react-router-dom";

function AuthContainer({ children, ...rest }) {

    const { isAuthenticated } = useSelector(state => state.authReducer);

    return (
        <Route {...rest}
            render={({ location }) =>
                isAuthenticated ? (
                    children
                ) : (
                    <Redirect to={{
                        pathname: "/login",
                        state: { from: location }
                    }} />
                )
            }
        />
    );
}

export default AuthContainer;
