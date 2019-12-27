import React, { useState, useEffect, useCallback } from 'react';
import { Provider, useStore, useSelector, useDispatch } from 'react-redux';
import { withPixiApp, Stage, } from '@inlet/react-pixi';

// Utils
import WindowSizeListener from 'react-window-size-listener';
import Fullscreen from 'react-full-screen';
import Animation from './Animation';

// Components
import GameMap from './GameMap';
import Unit from './Unit';
import Preloader from './Preloader';
import SoundPlayer from './SoundPlayer';

const DisplayGame = () => {

    const store = useStore();
    const dispatch = useDispatch();
    const { size } = useSelector(state => state.stageReducer);
    const { isInit } = useSelector(state => state.gameReducer);
    const { unitPosition } = useSelector(state => state.mapReducer);
    const { isFullscreen } = useSelector(state => state.stageReducer);

    const Loader = () => {
        const [percent, percentUpdate] = useState(0);
        console.info("percent: ", percent);
        if (percent < 100 && !isInit) {
            Animation(deltaTime => {
                // Pass on a function to the setter of the state
                // to make sure we always have the latest state
                // 
                percentUpdate(prevCount => (prevCount + deltaTime * 0.01) % 100);
            });
        } else {
            percentUpdate(101);
            dispatch({ type: 'INIT_GAME' })
        } 
            
        
        
        return <Preloader percent={Math.round(percent)} />;
    }

    // const interval = introSound.addEventListener('timeupdate', () => {
    //     const timerId = setInterval(() => {
    //         percentUpdate(introSound.currentTime);
    //         introSound.removeEventListener('timeupdate', interval);
    //     }, 1000 );
    //     clearInterval(timerId)
    // });

    // <SoundPlayer audioType="intro" />
    
    return  (
        <>
            { !isInit ? <><Loader /></> : 
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
                            onMount={() => console.info("GAME IS MOUNTED!")}
                        >
                            <Provider store={ store }>
                                <GameMap />
                                <Unit />
                            </Provider>
                        </Stage>
                    </Fullscreen>
                </WindowSizeListener>
            }
        </>
    )
};

const Display = withPixiApp(DisplayGame);

export default Display;