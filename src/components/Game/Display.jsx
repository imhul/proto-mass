import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Utils
import Fullscreen from 'react-full-screen';
import { playSFX } from '../../utils';

// Components
import GameMap from './GameMap';
import Preloader from './Preloader';

// Hooks
import useDOMState from '../../hooks/dom';

// Sounds
import introSFX from '../../assets/sound/loading.ogg';

const Display = () => {

    const dispatch = useDispatch();
    const dom = useDOMState();
    const { loadingPercent, isGameInit, isMapLoaded, isGameLoaded, settings } = useSelector(state => state.game);
    const { isFullscreen } = useSelector(state => state.stage);

    useEffect(() => {
        let step1, step2;
        if (dom.readyState === "complete" && isMapLoaded && !isGameInit) {
            step1 = setTimeout(() => dispatch({ type: 'LOADING_GAME', payload: 99 }), 1000);
        }
        if (isGameLoaded && !isGameInit) {
            step2 = setTimeout(() => dispatch({ type: 'INIT_GAME' }), 500);
        }

        return () => {
            clearTimeout(step1);
            clearTimeout(step2);
        }
        
    }, [dispatch, isMapLoaded, isGameLoaded, isGameInit, dom.readyState]);

    // TODO: UNCOMMENT !!! INTRO SOUND !!!
    // useEffect(() => playSFX(introSFX, settings.volume), [settings.volume]);

    const prevent = useCallback(e => {
        e.preventDefault();
    }, []);

    useEffect(() => {
        window.addEventListener('contextmenu', prevent);
    
        return () => {
          window.removeEventListener('contextmenu', prevent);
        };
    }, [prevent]);
    
    return <>
        { 
            !isGameInit ? <Preloader 
                percent={loadingPercent} 
            /> : null 
        }
        <Fullscreen 
            enabled={isFullscreen} 
            onChange={isFull => 
                dispatch({ type: 'FULLSCREEN', payload: isFull })}
        >
            <GameMap />
        </Fullscreen>
    </>
};

export default Display;