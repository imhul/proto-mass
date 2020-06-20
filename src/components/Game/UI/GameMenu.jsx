import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";

// Components
import { Drawer, Typography } from 'antd';
import SoundSlider from '../../Output/SoundSlider';
import Notify from '../../Output/Notify';

const { Title } = Typography;

const GameMenu = memo(() => {

    const history = useHistory();
    const dispatch = useDispatch();
    // const { isFullscreen } = useSelector(state => state.stage);
    const { isGameMenuOpen } = useSelector(state => state.game);
    const { clickPosition, isDraggable, zoom } = useSelector(state => state.map);
    const { unitList } = useSelector(state => state.unit);

    const onExitGame = () => {
        dispatch({ type: 'EXIT_GAME' })
        history.push('/');
    };

    const gameMenuTrigger = () => {
        dispatch({ type: 'TOGGLE_DRAWER' });
        dispatch({ type: 'TOGGLE_PAUSE_GAME' });
    }

    const onSaveGame = () => {
        dispatch({ 
            type: 'SAVE_GAME', 
            payload: { 
                units: [
                    {
                        id: '1001',
                        position: {
                            x: clickPosition.x,
                            y: clickPosition.y,
                        },
                    }
                ],
            },
        });
        Notify({
            type: "info",
            message: "Game Saved",
            icon: "save",
            duration: 3
        })
    };

    const onLoadGame = () => {
        console.warn("onLoadGame is run!");
    }

    return (
        <>
            <span className="Stats">
                <i className="anticon game-menu-btn touchable">L</i> {unitList.length}
            </span>
            <span>
                {   isDraggable && 
                    <i className="anticon game-menu-text-btn">&#x1F591;</i>
                }
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
                {/* TODO: resolve fullscreen Drawer visibility */}
            <Drawer
                title="MENU"
                placement="right"
                closable={false}
                onClose={() => gameMenuTrigger()}
                visible={isGameMenuOpen}
            >
                <div className="touchable" onClick={() => gameMenuTrigger()}>
                    <i className="anticon">7</i>
                    <Title level={4}>CONTINUE</Title>
                </div>
                <div 
                    className="touchable" 
                    onClick={() => dispatch({ type: 'FULLSCREEN', payload: true })}
                >
                    <i className="anticon">G</i>
                    <Title level={4}>FULLSCREEN</Title>
                </div>
                <div>
                    <i className="anticon">t</i>
                    <Title level={4}>SOUND LEVEL</Title>
                </div>
                <div>
                    <SoundSlider style={{width: 150}} />
                </div>
                <div className="touchable" onClick={() => onSaveGame()}>
                    <i className="anticon">6</i>
                    <Title level={4}>SAVE GAME</Title>
                </div>
                <div className="touchable" onClick={() => onLoadGame()}>
                    <i className="anticon">6</i>
                    <Title level={4}>LOAD GAME</Title>
                </div>
                <div className="touchable" onClick={() => onExitGame()}>
                    <i className="anticon">r</i>
                    <Title level={4}>EXIT GAME</Title>
                </div>
            </Drawer>
        </>
    )
});

export default GameMenu;
