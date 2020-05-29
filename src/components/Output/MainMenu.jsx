import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { Menu } from 'antd';

// Components
import UserMenu from './UserMenu';
import GameMenu from '../Game/UI/GameMenu';

const MainMenu = () => {

    const history = useHistory();
    const { isGameInit } = useSelector(state => state.game);

    const onWebMenuClick = useCallback(e => {
        // console.log('click ', e);
        history.push(e.key)
    }, [ history ]);

    return (
        <>
            { !isGameInit ? 
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
                    <UserMenu />
                </> : <GameMenu />
            }
        </>
    );
}

export default MainMenu;