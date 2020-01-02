import React, { useState } from 'react';
import { Provider, useStore, useSelector, useDispatch } from 'react-redux';
import { withPixiApp, Stage, } from '@inlet/react-pixi';

// Utils
import WindowSizeListener from 'react-window-size-listener';
import Fullscreen from 'react-full-screen';
import Animation from './Animation';
import utils from '../../utils';

// Components
import GameMap from './GameMap';
import Unit from './Unit';
import Preloader from './Preloader';

// Sounds
import intro from '../../assets/sound/thump.ogg';

const DisplayGame = () => {

    const store = useStore();
    const dispatch = useDispatch();
    const { size } = useSelector(state => state.stageReducer);
    const { isInit, settings } = useSelector(state => state.gameReducer);
    const { isFullscreen } = useSelector(state => state.stageReducer);

    const Loader = () => {
        const [percent, percentUpdate] = useState(0);
        if (percent < 100 && !isInit) {
            Animation(deltaTime => {
                percentUpdate(prevCount => prevCount + deltaTime * 0.1);
            });
            utils.playSFX(intro, settings.volume);
        } else {
            Animation(null);
            dispatch({ type: 'INIT_GAME' })
        }
        
        return <Preloader percent={Math.round(percent)} />;
    }
    
    return  (
        <>
            { !isInit ? <Loader /> : 
                <WindowSizeListener
                    onResize={output => dispatch({ type: 'RESIZE', payload: output })}
                >
                    {/* TODO: Fullscreen !!!  */}
                    <Fullscreen 
                        enabled={isFullscreen} 
                        onChange={() => dispatch({ type: 'FULLSCREEN' })}
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