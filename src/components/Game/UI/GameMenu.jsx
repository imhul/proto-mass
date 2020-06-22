import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const GameMenu = memo(() => {

    const dispatch = useDispatch();
    const { zoom } = useSelector(state => state.map);
    const { unitList } = useSelector(state => state.unit);

    const gameMenuTrigger = () => {
        dispatch({ type: 'TOGGLE_GAME_MENU_ESC' });
        dispatch({ type: 'TOGGLE_PAUSE_GAME' });
    }

    return (
        <>
            <span className="Stats">
                <i className="anticon game-menu-btn touchable">L</i> {unitList.length}
            </span>
            <span>
                <i className="anticon game-menu-btn touchable">&#x1F591;</i>
                <i 
                    className="anticon game-menu-text-btn touchable" 
                    onClick={() => dispatch({ type: 'MAP_DECREASE'}) }>-</i>
                <span>{ ` ${zoom}% ` }</span>
                <i 
                    className="anticon game-menu-text-btn touchable" 
                    onClick={() => dispatch({ type: 'MAP_INCREASE'}) }>+</i>
                
                <i 
                className="anticon game-menu-btn touchable" 
                onClick={() => gameMenuTrigger() }>j</i>
            </span>
        </>
    )
});

export default GameMenu;
