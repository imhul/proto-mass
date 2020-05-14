import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import WindowSizeListener from 'react-window-size-listener';
import Fullscreen from 'react-full-screen';
import { Zoom } from 'react-scaling';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

// Utils
import { getRandomInt, playSFX } from '../../utils';

// Components
import DnD from './DnD';
import Preloader from './Preloader';

// Hooks
import useDOMState from '../../hooks/dom';

// Sounds
// TODO: UNCOMMENT !!! INTRO SOUND !!!
// import introSFX from '../../assets/sound/loading.ogg';

const Display = () => {

    const dispatch = useDispatch();
    const dom = useDOMState();
    const { zoom, isDraggable } = useSelector(state => state.map);
    const { loadingPercent, isGameInit, isMapLoaded, isGameLoaded, isMapVisible, settings } = useSelector(state => state.game);
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

    const onWheel = useCallback(e => {
        if (e.deltaY < 0) {
            dispatch({ type: 'MAP_DECREASE'})
        } else if (e.deltaY > 0) {
            dispatch({ type: 'MAP_INCREASE'})
        }
    }, [dispatch]);

    const onKeydown = useCallback(e => {
        if (e.code === 'ControlLeft' && e.keyCode === 17 && !isDraggable) {
            dispatch({ type: 'MAP_IS_DRAGGABLE'})
        }
    }, [dispatch, isDraggable]);

    const onKeyup = useCallback(e => {
        if (e.code === 'ControlLeft' && e.keyCode === 17 && isDraggable) {
            dispatch({ type: 'MAP_NO_DRAGGABLE'})
        }
    }, [dispatch, isDraggable]);

    const onResize = useCallback(output => {
        dispatch({ type: 'RESIZE', payload: output });
        
        // TODO: need to resolve safity loading
        // if (!isGameInit && !isMapLoaded && loadingPercent < 40 && !isMapVisible) {
        //     dispatch({ type: 'MAP_LOADED' });
        //     dispatch({ type: 'LOADING_GAME', payload: getRandomInt(40, 60) });
        // }
    }, [dispatch, isGameInit, isMapLoaded, loadingPercent, isMapVisible]);

    useEffect(() => {
        window.addEventListener('contextmenu', prevent);
        window.addEventListener('wheel', onWheel);
        window.addEventListener('keydown', onKeydown);
        window.addEventListener('keyup', onKeyup);
    
        return () => {
            window.removeEventListener('contextmenu', prevent);
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('keydown', onKeydown);
            window.removeEventListener('keyup', onKeyup);
        };
    }, [onWheel, onKeydown, onKeyup, prevent]);
    
    return <>
        { 
            !isGameInit ? <Preloader 
                percent={loadingPercent} 
            /> : null 
        }
        <WindowSizeListener
            onResize={output => onResize(output)}
        >
            <Fullscreen 
                enabled={isFullscreen} 
                onChange={isFull => 
                    dispatch({ type: 'FULLSCREEN', payload: isFull })}
            >
                <Zoom 
                    zoom={zoom} 
                    style={{ 'cursor': isDraggable ? 'grab' : 'default' }}
                >
                    <DndProvider backend={Backend}>
                        <DnD />
                    </DndProvider>
                </Zoom>
            </Fullscreen>
        </WindowSizeListener>
    </>
};

export default Display;