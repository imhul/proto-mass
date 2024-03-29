import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';
import { Redirect } from 'react-router-dom';
import { Layout } from 'antd';

// Selectors
import { isGameInitSelector } from '../../selectors/game';
import { isAppInitSelector } from '../../selectors/app';

// Components
import MainHeader from './MainHeader';
import MainFooter from './MainFooter';
import HomePage from '../HomePage';
import AuthContainer from '../AuthContainer';
import NoFound from '../NoFound';
import Login from '../Login';
import Display from '../Game';

const { Content } = Layout;

const Output = ({ history }) => {
    const dispatch = useDispatch();
    const isGameInit = useSelector(isGameInitSelector);
    const isAppInit = useSelector(isAppInitSelector);

    useEffect(() => {
        if (!isAppInit) dispatch({ type: 'APP_INIT' });
    }, [isAppInit, dispatch]);

    return (
        <ConnectedRouter history={history} noInitialPop>
            <Layout className="Output">
                <MainHeader />

                <Content className={isGameInit ? 'game-active' : ''}>
                    <Switch>
                        <Route exact path="/">
                            <HomePage />
                        </Route>
                        <Route path="/login">
                            <Login />
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
                {!isGameInit && <MainFooter />}
            </Layout>
        </ConnectedRouter>
    );
};

export default Output;
