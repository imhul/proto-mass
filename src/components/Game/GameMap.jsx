import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { MapProvider, Map } from "./Map";
import IsometricMap, { IsometricTile, IsometricObject } from "react-isometric-tilemap";
import { Zoom } from 'react-scaling';

import styled from "styled-components";
import "react-isometric-tilemap/build/css/index.css";

// Actions
import { 
    mapClick,
    dragMapMove, 
    dragMapStop,
    // mapScaleUp,
    // mapScaleDown,
} from '../../redux/map/actions';

// Utils
import { getFrames, getRandomInt, mockedMap } from '../../utils';

// Graphic

// Sounds
import MapClick from '../../assets/sound/map_click.ogg';

const GameMap = () => { 

    // map constants

    const dispatch = useDispatch();
    const mapWidth = 30;
    const mapHeight = 30;
    const tileSize = 42;
    const offset = -(mapWidth * 5);
    const area = mapWidth * mapHeight;
    const tileList = Array.from(
        { length: area }, 
        (val, k) => (
            k <= mapWidth || 
            k.toString().indexOf('0') > -1 || 
            k.toString().indexOf('9', 1) > -1 || 
            k > area - mapWidth 
        ) ? val = 1 : val = getRandomInt(2, 9)
    );

    // effects

    const [zoom, setZoom] = useState(100);

    // TODO: solution: "+" & "-" buttons?
    const onWheel = useCallback(e => {
        const delta = e.deltaY || e.detail || e.wheelDelta;

        if (e.deltaY < 0) {
            console.log('scrolling up delta: ', delta);
            setZoom(zoom => zoom > 100 ? zoom - 10 : zoom);
        }
        else if (e.deltaY > 0) {
            console.log('scrolling down delta: ', delta);
            setZoom(zoom => zoom < 250 ? zoom + 10 : zoom);
        }
        

    }, []);

    useEffect(() => {
        window.addEventListener('wheel', onWheel);
    
        return () => {
          window.removeEventListener('wheel', onWheel);
        };
    }, [onWheel]);

    return (
        <Zoom zoom={zoom}>
            <IsometricMap 
                mapWidth={mapWidth} 
                mapHeight={mapHeight} 
                tileSize={tileSize} 
                slabSize={1}
                offsetY={offset}
            >
                {
                    mockedMap.map((tileId, index) => { // tileList[]
                        const x = index % mapWidth;
                        const y = Math.floor(index / mapWidth);
                        const result = [
                            <IsometricTile
                                key={`tile${index}`}
                                x={x}
                                y={y}
                                z={1}
                                frames={getFrames(true, tileId)}
                                onClick={() => dispatch({ type: 'MAP_CLICK', payload: {x: x, y: y} })}
                            />
                        ];
                        if (Math.random() < 0.1) {
                            result.push(
                                <IsometricObject
                                    key={`object${index}`}
                                    x={x}
                                    y={y}
                                    z={1}
                                    width={tileSize}
                                    height={92}
                                    frames={[require("../../assets/sprites/tree.png")]}
                                    active
                                />
                            );
                        }
                        return result;
                    }) 
                }
            </IsometricMap>
        </Zoom>
    );
      
}

//     const dispatch = useDispatch();
//     // const { size } = useSelector(state => state.stage);
//     const { mapPosition, isDragg } = useSelector(state => state.map);
//     const { current } = useSelector(state => state.unit);
//     const { settings } = useSelector(state => state.game);
//     const { isFullscreen } = useSelector(state => state.stage);
//     const [ keysPressed, setKeysPressed] = useState({});

//     const onMapClick = useCallback(event => {
//         // console.info("onMapClick event", event);
//         utils.playSFX(MapClick, settings.volume);
//         dispatch(mapClick(event));
//     }, [dispatch, settings.volume]);

//     const onKeyUp = event => {
//         if (isFullscreen && event.code === 'KeyM') {
//             dispatch({ type: 'TOGGLE_DRAWER' });
//             dispatch({ type: 'TOGGLE_PAUSE_GAME' });
//         }
//     }

//     const onKeyDown = useCallback(event => {
//         console.info("event.code: ", event.code);
//         const step = 10;
//         let keysPressed = {};ы
//         //     event.preventDefault();
//         //     event.stopPropagation();
//         if (current.status !== ('walk' || 'absent')) {
//             switch (event.code) {
//                 case 'ArrowUp': 
//                 case 'KeyW': 
//                     console.info("up");
//                     dispatch(dragMapMove({ 
//                         x: mapPosition.x, 
//                         y: mapPosition.y + step,
//                     }));
//                     break;
//                 case 'ArrowDown': 
//                 case 'KeyS':
//                     console.info("down");
//                     dispatch(dragMapMove({ 
//                         x: mapPosition.x, 
//                         y: mapPosition.y - step,
//                     }));
//                     break;
//                 case 'ArrowLeft': 
//                 case 'KeyA':
//                     console.info("left");
//                     dispatch(dragMapMove({ 
//                         x: mapPosition.x + step, 
//                         y: mapPosition.y,
//                     }));
//                     break;
//                 case 'ArrowRight': 
//                 case 'KeyD':
//                     console.info("right");
//                     dispatch(dragMapMove({ 
//                         x: mapPosition.x - step, 
//                         y: mapPosition.y,
//                     }));
//                     break;
//                 default:
//                     if (isDragg) dispatch(dragMapStop(event));
//                     break;
//             }
//         }
//     }, [dispatch, isDragg, mapPosition.x, mapPosition.y, current.status]);
    
//     useEffect(() => {
//         document.addEventListener('keyup', onKeyUp);
//         document.addEventListener('keydown', onKeyDown);
    
//         return () => {
//             document.removeEventListener('keyup', onKeyUp);
//             document.removeEventListener('keydown', onKeyDown);
//         };
//     }, [onKeyUp, onKeyDown]);

//     return <div mousedown={event => onMapClick(event)} />;
// }

export default GameMap;
