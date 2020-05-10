import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Utils
import Fullscreen from 'react-full-screen';
import { playSFX } from '../../utils';

// Components
import GameMap from './GameMap';
import Preloader from './Preloader';

// Sounds
import introSFX from '../../assets/sound/loading.ogg';

const Display = () => {

    // const store = useStore();
    const dispatch = useDispatch();
    const { loadingPercent } = useSelector(state => state.app);
    const { isInit, settings } = useSelector(state => state.game);
    const { isFullscreen } = useSelector(state => state.stage);

    useEffect(() => {
        dispatch({ type: 'START_LOADING_APP' })
        if (loadingPercent === 100) {
            dispatch({ type: 'LOADING_APP_COMPLETE' });
            dispatch({ type: 'INIT_GAME' });
        }
    }, [loadingPercent, dispatch]);

    useEffect(() => playSFX(introSFX, settings.volume), [settings.volume]);

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
            !isInit ? <Preloader 
                percent={loadingPercent} 
                style={{ 'zIndex': isInit ? 0 : 998 }} 
            /> : null 
        }
        <Fullscreen 
            enabled={isFullscreen} 
            onChange={isFull  => dispatch({ type: 'FULLSCREEN', payload: isFull })}
        >
            <GameMap />
        </Fullscreen>
    </>
};

export default Display;