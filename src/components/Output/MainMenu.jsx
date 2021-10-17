import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Menu } from 'antd';

// Selectors
import { getLoadingPercentSelector, isGameInitSelector } from '../../selectors/game';
import { isAuthenticatedSelector } from '../../selectors/auth';

// Components
import UserMenu from './UserMenu';
import GameMenu from '../Game/UI/GameMenu';

const MenuItem = Menu.Item;

const MainMenu = () => {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const isGameInit = useSelector(isGameInitSelector);
    const loadingPercent = useSelector(getLoadingPercentSelector);
    const isAuthenticated = useSelector(isAuthenticatedSelector);
    const [selectedKeys, setSelectedKeys] = useState([]);

    const onWebMenuClick = useCallback(
        e => {
            if (e.key !== 'game') dispatch({ type: 'EXIT_GAME' });
            history.push(e.key);
        },
        [dispatch, history]
    );

    useEffect(() => {
        if (location.pathname !== '/login') {
            setSelectedKeys([location.pathname]);
        } else {
            setSelectedKeys(['/']);
        }
    }, [location.pathname]);

    return (
        <>
            {!isGameInit ? (
                <>
                    {loadingPercent < 1 && (
                        <>
                            <Menu
                                selectedKeys={selectedKeys}
                                onClick={onWebMenuClick}
                                mode="horizontal"
                                theme="dark"
                            >
                                <MenuItem key="/">
                                    <i className="anticon">4</i>
                                    <span>Home</span>
                                </MenuItem>
                                <MenuItem key="/game" disabled={!isAuthenticated}>
                                    <i className="anticon">7</i>
                                    <span>Game</span>
                                </MenuItem>
                                <MenuItem key="/about">
                                    <a
                                        href="https://github.com/imhul/proto-mass"
                                        rel="noopener noreferrer"
                                        target="_blank"
                                        title="about"
                                    >
                                        <i className="anticon">Y</i>
                                        <span>About</span>
                                    </a>
                                </MenuItem>
                                <MenuItem key="/donate">
                                    <a
                                        href="https://www.patreon.com/protomass"
                                        rel="noopener noreferrer"
                                        target="_blank"
                                        title="donate"
                                    >
                                        <i className="anticon">c</i>
                                        <span>Donate</span>
                                    </a>
                                </MenuItem>
                            </Menu>
                            <UserMenu />
                        </>
                    )}
                </>
            ) : (
                <GameMenu />
            )}
        </>
    );
};

export default MainMenu;
