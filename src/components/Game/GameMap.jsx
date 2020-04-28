import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Actions
import { 
    mapClick,
    dragMapMove, 
    dragMapStop 
} from '../../redux/map/actions';

// Utils
import utils from '../../utils';

// Graphic
import ground from '../../assets/img/stage_bg.png';

// Sounds
import MapClick from '../../assets/sound/map_click.ogg';

const GameMap = () => { 

    const dispatch = useDispatch();
    // const { size } = useSelector(state => state.stage);
    const { mapPosition, isDragg } = useSelector(state => state.map);
    const { current } = useSelector(state => state.unit);
    const { settings } = useSelector(state => state.game);
    const { isFullscreen } = useSelector(state => state.stage);
    const [ keysPressed, setKeysPressed] = useState({});

    const onMapClick = useCallback(event => {
        // console.info("onMapClick event", event);
        utils.playSFX(MapClick, settings.volume);
        dispatch(mapClick(event));
    }, [dispatch, settings.volume]);

    const onKeyUp = event => {
        if (isFullscreen && event.code === 'KeyM') {
            dispatch({ type: 'TOGGLE_DRAWER' });
            dispatch({ type: 'TOGGLE_PAUSE_GAME' });
        }
    }

    const onKeyDown = useCallback(event => {
        console.info("event.code: ", event.code);
        const step = 10;
        let keysPressed = {};ы
        //     event.preventDefault();
        //     event.stopPropagation();
        if (current.status !== ('walk' || 'absent')) {
            switch (event.code) {
                case 'ArrowUp': 
                case 'KeyW': 
                    console.info("up");
                    dispatch(dragMapMove({ 
                        x: mapPosition.x, 
                        y: mapPosition.y + step,
                    }));
                    break;
                case 'ArrowDown': 
                case 'KeyS':
                    console.info("down");
                    dispatch(dragMapMove({ 
                        x: mapPosition.x, 
                        y: mapPosition.y - step,
                    }));
                    break;
                case 'ArrowLeft': 
                case 'KeyA':
                    console.info("left");
                    dispatch(dragMapMove({ 
                        x: mapPosition.x + step, 
                        y: mapPosition.y,
                    }));
                    break;
                case 'ArrowRight': 
                case 'KeyD':
                    console.info("right");
                    dispatch(dragMapMove({ 
                        x: mapPosition.x - step, 
                        y: mapPosition.y,
                    }));
                    break;
                default:
                    if (isDragg) dispatch(dragMapStop(event));
                    break;
            }
        }
    }, [dispatch, isDragg, mapPosition.x, mapPosition.y, current.status]);
    
    useEffect(() => {
        document.addEventListener('keyup', onKeyUp);
        document.addEventListener('keydown', onKeyDown);
    
        return () => {
            document.removeEventListener('keyup', onKeyUp);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyUp, onKeyDown]);

    return <div mousedown={event => onMapClick(event)} />;
}

export default GameMap;
