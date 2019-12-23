import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { useCookies, withCookies } from 'react-cookie';
import { Menu, Icon } from 'antd';

// Components
import UserMenu from './UserMenu';

const MainMenu = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.authReducer);
    const [cookie, removeCookie] = useCookies(['userId']);

    const signout = () => {
        if (isAuthenticated) setTimeout(() => {
            dispatch({ type: 'SET_AUTH_LOGOUT' });
            removeCookie('userId');
            history.push("/");
        }, 2000);
    }

    const signin = () => {
        history.push('/login');
    }

    const handleClick = e => {
        console.log('click ', e);
        history.push(e.key)
    };

    return (
        <>
            <Menu onClick={handleClick} mode="horizontal" theme="dark">
                <Menu.Item key="/">
                    <Icon type="home" />
                    <span>Home</span>
                </Menu.Item>
                <Menu.Item key="game">
                    <Icon type="play-circle" />
                    <span>Game</span>
                </Menu.Item>
                <Menu.Item 
                    key='login'
                    onClick={ isAuthenticated ? signout : signin }
                >
                    { isAuthenticated ? <Icon type="logout" /> : <Icon type="login" /> }
                    { isAuthenticated ? <span>logout</span> : <span>login</span> }
                </Menu.Item>
            </Menu>
            <UserMenu />
        </>
    );
}

export default withCookies(MainMenu);