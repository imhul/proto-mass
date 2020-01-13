import React from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router';
import { Redirect } from "react-router-dom";

// Components
import Notify from '../Output/Notify';

function AuthContainer({ children, ...rest }) {

    const { isAuthenticated } = useSelector(state => state.auth);

    return (
        <Route {...rest}
            render={({ location }) =>
            // TODO: Check location for errors on SET_AUTH_LOGOUT
                isAuthenticated ? (
                    children
                ) : ( 
                    <>
                        {
                            Notify({
                                type: "warn",
                                message: "You are not logged in",
                                description: "To play the game, you must first authenticate! Or you can just return to the home page;)",
                                icon: "warning",
                                duration: 3
                            })
                        }
                        <Redirect to={{
                            pathname: "/login",
                            state: { from: location }
                        }} />
                    </>
                )
            }
        />
    );
}

export default AuthContainer;
