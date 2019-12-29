import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import { useCookies, withCookies } from 'react-cookie';
import { Menu, Drawer, Icon } from 'antd';

// Components
import UserMenu from './UserMenu';

const MainMenu = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const location = useLocation();
    const { isAuthenticated } = useSelector(state => state.authReducer);
    const { isInit } = useSelector(state => state.gameReducer);
    const { isFullscreen } = useSelector(state => state.stageReducer);
    const [cookie, removeCookie] = useCookies(['userId']);
    const [isDrawerOpen, onDrawer] = useState(false);

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
                            <i className="anticon">4</i>
                            <span>Home</span>
                        </Menu.Item>
                        <Menu.Item key="game">
                            <i className="anticon">7</i>
                            <span>Game</span>
                        </Menu.Item>
                    </Menu>
                    { location.pathname !== '/login' && !isAuthenticated ? <UserMenu /> : null} 
                </> : <>
                    <i className="anticon game-menu-btn" onClick={() => onDrawer(true)}>j</i>
                    <Drawer
                        title="MENU"
                        placement="right"
                        closable={false}
                        onClose={() => onDrawer(false)}
                        visible={isDrawerOpen}
                        >
                        <Icon 
                            className="game-menu-btn"
                            type="plus-square" 
                            onClick={() => gameMenuToggle()}
                        />
                        <br />
                        <Icon 
                            className="game-menu-btn"
                            type={ isFullscreen ? "fullscreen-exit" : "fullscreen" }
                            onClick={() => dispatch({ type: 'FULLSCREEN' })} 
                        />
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                    </Drawer>
                </>
            }
        </>
    );
}

export default withCookies(MainMenu);