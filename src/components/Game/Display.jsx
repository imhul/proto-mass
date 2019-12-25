import React from 'react';
import { Provider, useStore, useSelector, useDispatch } from 'react-redux';
import { withPixiApp, Stage, } from '@inlet/react-pixi';

// screen size utils
import WindowSizeListener from 'react-window-size-listener';
import Fullscreen from 'react-full-screen';

// Components
import GameMap from './GameMap';
import Unit from './Unit';

const DisplayGame = () => {

    const store = useStore();
    const dispatch = useDispatch();
    const { size } = useSelector(state => state.stageReducer);
    const { isInit } = useSelector(state => state.gameReducer);
    const { unitPosition } = useSelector(state => state.mapReducer);
    const { isFullscreen } = useSelector(state => state.stageReducer);

    return  (
         <WindowSizeListener
            onResize={output => dispatch({ type: 'RESIZE', payload: output })}
        >
            {/* TODO: Fullscreen !!!  */}
            <Fullscreen 
                enabled={isFullscreen} 
                onChange={isFull => dispatch({ type: 'FULLSCREEN' })}
            >
                <Stage 
                    className="Game"    
                    width={size.width} 
                    height={size.height} 
                    onMount={() => {
                        if (!isInit) {
                            dispatch({ type: 'INIT_GAME' });
                        }
                    }}
                >
                    <Provider store={ store }>
                        <GameMap />
                        <Unit />
                    </Provider>
                </Stage>
            </Fullscreen>
        </WindowSizeListener>
    )
};

const Display = withPixiApp(DisplayGame);

export default Display;