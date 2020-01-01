import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { Drawer, Progress, Typography, Icon } from 'antd';

// Components
import SoundSlider from './SoundSlider';
import Notify from '../Output/Notify';

const { Title } = Typography;

const GameMenu = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const { isFullscreen } = useSelector(state => state.stageReducer);
    const { isGameMenuOpen, settings } = useSelector(state => state.gameReducer);
    const { unitPosition } = useSelector(state => state.mapReducer);

    const onExit = () => {
        dispatch({ type: 'EXIT_GAME' })
        history.push('/');
    };

    const onDrawer = () => {
        dispatch({ type: 'TOGGLE_DRAWER' });
        dispatch({ type: 'TOGGLE_PAUSE_GAME' });
    }

    const onSave = () => {
        dispatch({ 
            type: 'SAVE_GAME', 
            payload: { 
                player: {
                    position: {
                        x: unitPosition.x,
                        y: unitPosition.y,
                    },
                },
            },
        });
        Notify({
            type: "info",
            message: "Game Saved",
            icon: "save",
            duration: 3
        })
    };

    return (
        <>
            <i className="anticon game-menu-btn touchable" onClick={() => {
                onDrawer();
                // TODO: get from cookies!
            }}>j</i>
            <Drawer
                title="MENU"
                placement="right"
                closable={false}
                onClose={() => onDrawer()}
                visible={isGameMenuOpen}
            >
                <div className="touchable" onClick={() => onDrawer()}>
                    <i className="anticon">7</i>
                    <Title level={4}>CONTINUE</Title>
                </div>
                <div className="touchable" onClick={() => dispatch({ type: 'FULLSCREEN' })}>
                    <i className="anticon">G</i>
                    <Title level={4}>FULLSCREEN</Title>
                </div>
                <div>
                    <i className="anticon">t</i>
                    <Title level={4}>SOUND LEVEL</Title>
                </div>
                <div>
                    <SoundSlider />
                </div>
                <div className="touchable" onClick={() => onSave()}>
                    <i className="anticon">6</i>
                    <Title level={4}>SAVE GAME</Title>
                </div>
                <div className="touchable" onClick={() => onExit()}>
                    <i className="anticon">r</i>
                    <Title level={4}>EXIT GAME</Title>
                </div>
            </Drawer>
        </>
    )
}

export default GameMenu;
