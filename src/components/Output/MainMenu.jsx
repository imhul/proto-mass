import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import { Menu } from 'antd';

// Components
import UserMenu from './UserMenu';
import GameMenu from './GameMenu';

const MainMenu = () => {

    const history = useHistory();
    const location = useLocation();
    const { isInit } = useSelector(state => state.gameReducer);

    const onWebMenuClick = e => {
        console.log('click ', e);
        history.push(e.key)
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
                    { location.pathname !== '/login' ? <UserMenu /> : null } 
                </> : <GameMenu />
            }
        </>
    );
}

export default MainMenu;