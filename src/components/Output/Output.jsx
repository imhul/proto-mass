import React from 'react';
import { useSelector } from 'react-redux';
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

    const { isInit } = useSelector(state => state.game);

    return (
        <ConnectedRouter history={history}>
            <Layout className="Output">
                <MainHeader />
                    
                <Content className={isInit ? 'game-active' : '' }>
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
                { !isInit && <MainFooter /> }
            </Layout>
        </ConnectedRouter>
    )
};

export default Output;
