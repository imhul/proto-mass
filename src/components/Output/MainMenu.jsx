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
    const { isInit } = useSelector(state => state.gameReducer);
    const { isFullscreen } = useSelector(state => state.stageReducer);
    const [cookie, removeCookie] = useCookies(['userId']);

    const signout = () => {
        if (isAuthenticated && cookie.userId) setTimeout(() => {
            dispatch({ type: 'SET_AUTH_LOGOUT' });
            removeCookie('userId');
            history.push("/");
        }, 2000);

        // if (isAuthenticated && cookie.userId) {
        //     dispatch({ type: 'SET_AUTH_LOGOUT' });
        //     removeCookie('userId');
        //     history.push("/");
        // }
    }

    const signin = () => {
        history.push('/login');
    }

    const onWebMenuClick = e => {
        console.log('click ', e);
        history.push(e.key)
    };

    const gameMenuToggle = e => {
        console.log('click ', e);
        if (false) { // if exit game
            history.push('/');
        }
    };

    return (
        <>
            { !isInit ? 
                <>
                    <Menu onClick={onWebMenuClick} mode="horizontal" theme="dark">
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
                </> : <>
                    <Icon 
                        className="game-menu-btn"
                        type="plus-square" 
                        onClick={() => gameMenuToggle()} />
                    <Icon 
                        className="game-menu-btn"
                        type={ isFullscreen ? "fullscreen-exit" : "fullscreen" }
                        onClick={() => dispatch({ type: 'FULLSCREEN' })} 
                    />
                </>
            }
        </>
    );
}

export default withCookies(MainMenu);