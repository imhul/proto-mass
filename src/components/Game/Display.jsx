import React, { useState } from 'react';
import { Provider, useStore, useSelector, useDispatch } from 'react-redux';
import { withPixiApp, Stage, } from '@inlet/react-pixi';

// screen size utils
import WindowSizeListener from 'react-window-size-listener';
import Fullscreen from 'react-full-screen';

// Components
import GameMap from './GameMap';
import Unit from './Unit';
import Preloader from './Preloader';

// Sounds
import intro from '../../assets/ogg/thump.ogg';

const DisplayGame = () => {

    const store = useStore();
    const dispatch = useDispatch();
    const { size } = useSelector(state => state.stageReducer);
    const { isInit } = useSelector(state => state.gameReducer);
    const { unitPosition } = useSelector(state => state.mapReducer);
    const { isFullscreen } = useSelector(state => state.stageReducer);

    const introSound = new Audio(intro);

    const play = introSound.addEventListener('loadeddata', () => {
        if(introSound.paused && !introSound.playing && !introSound.progress) {
            introSound.play();
            introSound.removeEventListener('loadeddata', play);
        }
        
    });
    introSound.addEventListener('ended', () => {
        console.info("ended: ", introSound.ended);
        if (!isInit) {
            dispatch({ type: 'INIT_GAME' });
        }
    });

    const [perent, percentUpdate] = useState(0);

    const interval = introSound.addEventListener('timeupdate', () => {
        const timerId = setInterval(() => {
            percentUpdate(introSound.currentTime);
            introSound.removeEventListener('timeupdate', interval);
        }, 1000 );
        clearInterval(timerId)
    });
    
    return  (
        <>
            { !isInit ? <Preloader percent={perent} /> : 
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