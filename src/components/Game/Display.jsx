import React, { useState, useEffect, useCallback } from 'react';
import { Provider, useStore, useSelector, useDispatch } from 'react-redux';
import { withPixiApp, Stage, TilingSprite } from '@inlet/react-pixi';

// Utils
import WindowSizeListener from 'react-window-size-listener';
import Fullscreen from 'react-full-screen';
import Animation from './Animation';
import utils from '../../utils';

// Components
import GameMap from './GameMap';
import Unit from './Unit';
import Preloader from './Preloader';
import TransparentLayer from './TransparentLayer';

// Sounds
import intro from '../../assets/sound/loading.ogg';

const DisplayGame = () => {

    const store = useStore();
    const dispatch = useDispatch();
    const { size } = useSelector(state => state.stage);
    const { isInit, settings } = useSelector(state => state.game);
    const { isFullscreen } = useSelector(state => state.stage);

    useEffect(() => utils.playSFX(intro, settings.volume), []);

    const onPressM = event => {
        if (isFullscreen && event.code === 'KeyM') {
            dispatch({ type: 'TOGGLE_DRAWER' });
            dispatch({ type: 'TOGGLE_PAUSE_GAME' });
        }
    }

    useEffect(() => {
        window.addEventListener('keyup', onPressM);
    
        return () => {
          window.removeEventListener('keyup', onPressM);
        };
    }, [onPressM]);

    const Loader = () => {
        const [percent, percentUpdate] = useState(0);
        if (percent < 100 && !isInit) {
            Animation(deltaTime => {
                percentUpdate(prevCount => prevCount + deltaTime * 0.1);
            });
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
                    <Fullscreen 
                        enabled={isFullscreen} 
                        onChange={isFull  => dispatch({ type: 'FULLSCREEN', payload: isFull })}
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
                                <TransparentLayer />
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