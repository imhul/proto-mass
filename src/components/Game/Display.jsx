import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withPixiApp, Stage, } from '@inlet/react-pixi';

// utils
import WindowSizeListener from 'react-window-size-listener';
import Fullscreen from 'react-full-screen';

// Components
import Unit from './Unit';

const DisplayGame = () => {

    const dispatch = useDispatch();
    const { size } = useSelector(state => state.stageReducer);
    const { isInit } = useSelector(state => state.gameReducer);
    const { isFullscreen } = useSelector(state => state.stageReducer);

    if (!isInit) {
        dispatch({ type: 'INIT_GAME' });
    }

    return  (
        <WindowSizeListener
            onResize={output => dispatch({ type: 'RESIZE', payload: output })}
        >
            {/* TODO: Fullscreen !!! */}
            <Fullscreen enabled={isFullscreen} onChange={isFull => dispatch({ type: 'FULLSCREEN' })}>
                <Stage width={size.width} height={size.height}>
                    <Unit />
                </Stage>
            </Fullscreen>
        </WindowSizeListener>
    )
};

const Display = withPixiApp(DisplayGame)

export default Display;