import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';
import { Redirect } from "react-router-dom";
import { Layout } from 'antd';

// Components
import MainHeader from './MainHeader';
import MainFooter from './MainFooter';
import HomePage from '../HomePage';
import AuthContainer from '../AuthContainer';
import NoFound from '../NoFound';
import LoginPage from '../Login';
import Display from '../Game';

const { Content } = Layout;

const Output = ({ history }) => {

    return (
        <ConnectedRouter history={history}>
            <Layout className="Output">
                <MainHeader />
                    
                <Content>
                    <Switch>
                        <Route exact path="/">
                            <HomePage />
                        </Route>
                        <Route path="/login">
                            <LoginPage />
                        </Route>
                        <Route path="/error">
                            <NoFound />
                        </Route>
                        <AuthContainer path="/game">
                            <Display />
                        </AuthContainer>
                        <Redirect from="*" to="/error" />
                    </Switch>
                </Content>
                <MainFooter />
            </Layout>
        </ConnectedRouter>
    )
};

export default Output;
