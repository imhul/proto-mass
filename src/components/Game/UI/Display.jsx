import React, { memo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Helpers
import WindowSizeListener from 'react-window-size-listener';
import Fullscreen from 'react-full-screen';
import { Zoom } from 'react-scaling';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

// Components
import DnD from './DnD';
import Preloader from './Preloader';
import TimeMachine from './TimeMachine';
import StartOrLoadModal from '../Modals/StartOrLoad';
import GameMenuEsc from '../Modals/GameMenuEsc';
import StartInfo from '../Modals/StartInfo';
import LeftGameInfoPanel from './LeftGameInfoPanel';
import RightGameInfoPanel from './RightGameInfoPanel';
import UserActionInfo from './UserActionInfo';

// Hooks
import { useDOMState } from '../../../hooks';

// Utils
import { 
    getRandomInt, 
    // playSFX,
} from '../../../utils';
// TODO: UNCOMMENT !!! INTRO SOUND !!!
// Sounds
// import introSFX from '../../assets/sound/loading.ogg';

// graphic
import starship from '../../../assets/img/parallax_starship_1.png';

const Display = memo(() => {

    const dispatch = useDispatch();
    const dom = useDOMState();
    const { zoom, isDraggable } = useSelector(state => state.map);
    const { isFullscreen, isFirstResize } = useSelector(state => state.stage);
    // const { user } = useSelector(state => state.auth);
    // const { auth, profile } = useSelector(state => state.firebase);
    // const { unitList } = useSelector(state => state.unit);
    const { 
        isStartOrLoadModalOpen,
        loadingPercent, 
        isGameInit, 
        isMapLoaded, 
        isGameLoaded, 
        isGameStarted,
        // isLoadSavedGame,
    } = useSelector(state => state.game);

    // game loading
    useEffect(() => {
        let step1, step2;

        if (!isStartOrLoadModalOpen && !isGameInit) {  
            if (dom.readyState === "complete" && isMapLoaded && loadingPercent !== 99) {
                step1 = setTimeout(() => 
                dispatch({ 
                    type: 'LOADING_GAME_UPDATE', 
                    payload: 99, 
                    meta: 'almost all ready' 
                }), 500);
            }
            if (isGameLoaded) {
                step2 = setTimeout(() => 
                dispatch({ 
                    type: 'INIT_GAME', 
                }), 500);
            }
        }

        return () => {
            clearTimeout(step1);
            clearTimeout(step2);
        }
    }, [
        dispatch, 
        isStartOrLoadModalOpen,
        isMapLoaded, 
        isGameLoaded, 
        isGameInit, 
        dom.readyState,
        loadingPercent
    ]);

    // TODO: UNCOMMENT !!! INTRO SOUND !!!
    // useEffect(() => playSFX(introSFX, settings.volume), [settings.volume]);

    // display handlers
    const prevent = useCallback(e => {
        e.preventDefault();
    }, []);

    const onWheel = useCallback(e => {
        if (e.deltaY < 0) {
            dispatch({ type: 'MAP_INCREASE'})
        } else if (e.deltaY > 0) {
            dispatch({ type: 'MAP_DECREASE'})
        }
    }, [dispatch]);

    const onKeydown = useCallback(e => {
        console.info("onKeydown event: ", e);
    }, []);

    const onKeyup = useCallback(e => {
        console.info("onKeydown event: ", e);
        if (e.key === 'Escape' || e.code === 'Escape') {
            dispatch({ type: 'TOGGLE_GAME_MENU_ESC' });
            dispatch({ type: 'TOGGLE_PAUSE_GAME' });
        }
    }, [dispatch]);

    const onResize = useCallback(output => {
        if (!isFirstResize) {
            if (isMapLoaded) {
                dispatch({ 
                    type: 'RESIZE', 
                    payload: output,
                    meta: true,
                });
                !isGameInit && dispatch({ 
                    type: 'LOADING_GAME_UPDATE', 
                    payload: getRandomInt(21, 31),
                    meta: "coordinate calculation"
                })
            }
        } else {
            dispatch({ 
                type: 'RESIZE', 
                payload: output, 
                meta: false,
            });
        }
    }, [isMapLoaded, isFirstResize, isGameInit, dispatch]);

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
    }, [prevent, onWheel, onKeydown, onKeyup]);
    
    return <>
        { 
            !isGameInit && isStartOrLoadModalOpen ? <StartOrLoadModal /> :
            <> 
                {
                   !isGameInit && <Preloader percent={loadingPercent} />
                }
                <WindowSizeListener
                    onResize={output => onResize(output)}
                >
                    <Fullscreen 
                        enabled={isFullscreen} 
                        onChange={isFull => 
                            dispatch({ type: 'FULLSCREEN', payload: isFull })}
                    >
                        <div id="bg-game"></div>
                        <div id="bg-parallax"></div>
                        <div id="mg-parallax"></div>
                        <div id="fg-parallax"></div>
                        <div id="starship" style={{backgroundImage: `url(${starship})`}}></div>
                        <Zoom zoom={zoom} 
                            style={{ 'cursor': isDraggable ? 'grab' : 'default' }}
                        >
                            <DndProvider backend={Backend}>
                                <DnD />
                                {
                                    isGameLoaded && isGameInit && !isGameStarted ? <StartInfo /> : null
                                }
                                <GameMenuEsc />
                            </DndProvider>
                        </Zoom>

                        {
                            isGameInit && isGameStarted ? <>
                                <LeftGameInfoPanel />

                                <RightGameInfoPanel>
                                    {/* <TimeMachine /> */}
                                    <UserActionInfo />
                                </RightGameInfoPanel>
                                
                            </> : null 
                        }
                    </Fullscreen>
                </WindowSizeListener>
            </>
        }
    </>
});

export default Display;
