import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import { Menu } from 'antd';

// Components
import UserMenu from './UserMenu';
import GameMenu from '../Game/UI/GameMenu';

const MainMenu = () => {

    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const { isGameInit } = useSelector(state => state.game);
    const [selectedKeys, setSelectedKeys] = useState([]);

    const onWebMenuClick = useCallback(e => {
        if (e.key !== "game") dispatch({ type: 'EXIT_GAME' });
        history.push(e.key)
    }, [dispatch, history]);

    useEffect(() => {
        if (location.pathname !== '/login') {
            setSelectedKeys([location.pathname])
        } else {
            setSelectedKeys(['/'])
        }
    }, [location.pathname]);

    return (
        <>
            {!isGameInit ?
                <>
                    <Menu 
                        selectedKeys={selectedKeys}
                        onClick={onWebMenuClick} 
                        mode="horizontal" 
                        theme="dark"
                    >
                        <Menu.Item key="/">
                            <i className="anticon">4</i>
                            <span>Home</span>
                        </Menu.Item>
                        <Menu.Item key="/game">
                            <i className="anticon">7</i>
                            <span>Game</span>
                        </Menu.Item>
                    </Menu>
                    <UserMenu />
                </> : <GameMenu />
            }
        </>
    );
}

export default MainMenu;