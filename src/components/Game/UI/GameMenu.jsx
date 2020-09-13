import React, { memo, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Selectors
import { 
    isGameStartedSelector,
    isGamePausedSelector,
} from '../../../selectors/game';
import { unitsSelector } from '../../../selectors/units';

// Components
import { Drawer } from 'antd';
import Notify from '../../Output/Notify';

const GameMenu = memo(() => {

    const dispatch = useDispatch();
    const isGameStarted = useSelector(isGameStartedSelector);
    const isGamePaused = useSelector(isGamePausedSelector);
    const unitList = useSelector(unitsSelector);
    const [visible, setVisible] = useState(false);
    const closeMenuTimer = useRef(null);

    const gameMenuTrigger = () => {
        setVisible(false);
        dispatch({ type: 'TOGGLE_GAME_MENU_ESC' });
        dispatch({ type: 'TOGGLE_PAUSE_GAME' });
    }

    const hideMenu = useCallback(() => {
        closeMenuTimer.current = setTimeout(() => setVisible(false), 6000);
    }, [closeMenuTimer]);

    const showMenu = useCallback(() => {
        if (!visible) {
            clearTimeout(closeMenuTimer.current);
            setVisible(true);
        }
    }, [visible, closeMenuTimer, setVisible]);

    const onDirectControl = useCallback(() => {
        Notify({
            type: "info",
            message: "Direct Control Mode in development. Coming soon!",
            icon: "info",
            duration: 4
        })
    }, []);

    const onUserList = useCallback(() => {
        Notify({
            type: "info",
            message: "User List in development. Coming soon!",
            icon: "info",
            duration: 4
        })
    }, []);

    return (
        <>
            <div 
                className="game-menu-hover-box" 
                onMouseOver={() => (isGameStarted && !isGamePaused) && showMenu()}
                onMouseOut={() => (isGameStarted && !isGamePaused) && hideMenu()}
            />
            <Drawer
                placement="top"
                closable={false}
                onClose={() => setVisible(false)}
                visible={visible}
                key="top game menu"
            >
                <span className="Stats" onClick={() => onUserList()}>
                    <i className="game-menu-btn touchable">L</i>
                    <i>{unitList.length}</i>
                </span>
                <span>
                    <i 
                        className="game-menu-btn touchable"
                        onClick={() => onDirectControl() }>&#x1F591;</i>
                    
                    <i 
                        className="game-menu-btn touchable" 
                        onClick={() => gameMenuTrigger() }>j</i>
                </span>
            </Drawer>
        </>
    )
});

export default GameMenu;
