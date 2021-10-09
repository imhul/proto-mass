import React, { memo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Particles from 'react-particles-js';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import GameMap from '../Map/GameMap';
import Preloader from './Preloader';
// import TimeMachine from './TimeMachine';
import StartOrLoadModal from '../Modals/StartOrLoad';
import GameMenuEsc from '../Modals/GameMenuEsc';
import StartInfo from '../Modals/StartInfo';
import LeftGameInfoPanel from './LeftGameInfoPanel';
import RightGameInfoPanel from './RightGameInfoPanel';
import UserActionInfo from './UserActionInfo';
import WindowSizeListener from 'react-window-size-listener';
import Notify from '../../Output/Notify';

// Selectors
import {
    isFullscreenSelector,
    isFirstResizeSelector,
} from '../../../selectors/stage';

import {
    // isLoadSavedGameSelector,
    // isGamePausedSelector,
    isGameStartedSelector,
    getLoadingPercentSelector,
    isMapLoadedSelector,
    isStartOrLoadModalOpenSelector,
    isGameInitSelector,
    isGameErrorSelector,
    isGameLoadedSelector,
} from '../../../selectors/game';

// Hooks
import { useDOMState } from '../../../hooks';

// Utils
import {
    getRandomInt,
    // playSFX,
} from '../../../utils';
import _ from 'lodash';
// TODO: UNCOMMENT !!! INTRO SOUND !!!
// Sounds
// import introSFX from '../../assets/sound/loading.ogg';

// graphic
import starship from '../../../assets/img/parallax_starship_1.png';

const Display = memo(() => {

    const handleFullScreen = useFullScreenHandle();
    const dispatch = useDispatch();
    const dom = useDOMState();
    const isFullscreen = useSelector(isFullscreenSelector);
    const isFirstResize = useSelector(isFirstResizeSelector);
    const isStartOrLoadModalOpen = useSelector(isStartOrLoadModalOpenSelector);
    const loadingPercent = useSelector(getLoadingPercentSelector);
    const isGameInit = useSelector(isGameInitSelector);
    const isMapLoaded = useSelector(isMapLoadedSelector);
    const isGameLoaded = useSelector(isGameLoadedSelector);
    const isGameStarted = useSelector(isGameStartedSelector);
    const error = useSelector(isGameErrorSelector);

    useEffect(() => {
        if (!document.body.classList.contains('game') && isGameInit) {
            document.body.classList.add('game');
        }
        return () => {
            document.body.classList.remove('game');
        }
    }, [isGameInit]);

    // error
    useEffect(() => {
        if (!_.isEmpty(error)) Notify({
            type: "error",
            message: "Game Error!",
            icon: "warning",
            duration: 4
        })
    }, [error]);

    useEffect(() => {
        // TODO: Fix fullscreen styles!
        // TODO: Fix stars animated background
        if (isFullscreen) handleFullScreen.enter();

        return () => {
            handleFullScreen.exit();
        }
    }, [isFullscreen]);

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
            dispatch({ type: 'MAP_INCREASE' })
        } else if (e.deltaY > 0) {
            dispatch({ type: 'MAP_DECREASE' })
        }
    }, [dispatch]);

    const onKeydown = useCallback(e => {
        if (isGameStarted) console.info("onKeydown event: ", e);
    }, [isGameStarted]);

    const onKeyup = useCallback(e => {
        if ((e.key === 'Escape' || e.code === 'Escape') && isGameStarted) {
            dispatch({ type: 'TOGGLE_GAME_MENU_ESC' });
            dispatch({ type: 'TOGGLE_PAUSE_GAME' });
            // console.info("onKeydown event: ", e);
        }
    }, [isGameStarted, dispatch]);

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
        window.addEventListener('keydown', onKeydown);
        window.addEventListener('keyup', onKeyup);

        return () => {
            window.removeEventListener('contextmenu', prevent);
            window.removeEventListener('keydown', onKeydown);
            window.removeEventListener('keyup', onKeyup);
        }
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
                        <FullScreen
                            handle={handleFullScreen}
                            onChange={isFull =>
                                dispatch({ type: 'FULLSCREEN', payload: isFull })
                            }
                        >
                            <div id="bg-game">
                                <Particles params={{
                                    particles: {
                                        number: {
                                            value: 400,
                                            density: {
                                                enable: true,
                                                value_area: 500
                                            }
                                        },
                                        color: {
                                            value: "#ffffff"
                                        },
                                        shape: {
                                            type: "circle",
                                            stroke: {
                                                width: 0,
                                            },
                                            polygon: {
                                                nb_sides: 5
                                            },
                                        },
                                        opacity: {
                                            value: 0.5,
                                            random: false,
                                            anim: {
                                                enable: true,
                                                speed: 0.3,
                                                opacity_min: 0.4,
                                                sync: false
                                            }
                                        },
                                        size: {
                                            value: 1,
                                            random: true,
                                            anim: {
                                                enable: false,
                                            }
                                        },
                                        line_linked: {
                                            enable: false,
                                        },
                                        move: {
                                            enable: true,
                                            speed: 0.5,
                                            direction: "left",
                                            random: false,
                                            straight: true,
                                            out_mode: "out",
                                            bounce: false,
                                            attract: {
                                                enable: false,
                                            }
                                        }
                                    },
                                    interactivity: {
                                        detect_on: "canvas",
                                        events: {
                                            onhover: {
                                                enable: false,
                                            },
                                            onclick: {
                                                enable: false,
                                            },
                                            resize: true
                                        },
                                        modes: {
                                            grab: {
                                                distance: 400,
                                                line_linked: {
                                                    opacity: 1
                                                }
                                            },
                                            bubble: {
                                                distance: 83.91608391608392,
                                                size: 1,
                                                duration: 3,
                                                opacity: 1,
                                                speed: 3
                                            },
                                            repulse: {
                                                distance: 200,
                                                duration: 0.4
                                            },
                                            push: {
                                                particles_nb: 4
                                            },
                                            remove: {
                                                particles_nb: 2
                                            }
                                        }
                                    },
                                    retina_detect: true
                                }} />
                            </div>
                            {/* <div id="bg-parallax"></div>
                        <div id="mg-parallax"></div>
                        <div id="fg-parallax"></div> */}
                            <div id="starship" style={{ backgroundImage: `url(${starship})` }}></div>

                            <TransformWrapper
                                options={{
                                    limitToWrapper: true,
                                }}
                                pan={{
                                    velocityEqualToMove: true,
                                    velocity: true,
                                    velocitySensitivity: 6,
                                }}
                                pinch={{ disabled: false }}
                                doubleClick={{ disabled: false }}
                                wheel={{
                                    step: 30,
                                }}
                            >
                                <TransformComponent>
                                    <GameMap />
                                </TransformComponent>
                            </TransformWrapper>
                            {
                                isGameLoaded && isGameInit && !isGameStarted ? <StartInfo /> : null
                            }
                            <GameMenuEsc />
                            {
                                isGameInit && isGameStarted ? <>
                                    <LeftGameInfoPanel />

                                    <RightGameInfoPanel>
                                        {/* <TimeMachine /> */}
                                        <UserActionInfo />
                                    </RightGameInfoPanel>

                                </> : null
                            }
                        </FullScreen>
                    </WindowSizeListener>
                </>
        }
    </>
});

export default Display;
