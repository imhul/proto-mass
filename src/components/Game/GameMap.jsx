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
import { getFrames, getRandomInt } from '../../utils';

// Graphic

// Sounds
import MapClick from '../../assets/sound/map_click.ogg';

const GameMap = () => { 

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
    const mockedMap = [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,8,6,7,4,3,2,6,8,1,1,5,5,4,5,4,6,6,5,1,1,3,2,7,4,6,5,8,5,1,
        1,4,2,3,4,2,6,2,7,1,1,2,8,7,7,5,2,2,3,1,1,8,6,7,7,2,4,4,5,1,
        1,2,4,8,2,5,8,6,8,8,8,8,1,1,1,1,1,1,1,1,1,5,8,7,4,8,8,7,8,1,
        1,5,7,3,8,7,4,6,4,1,1,3,3,5,7,6,4,8,4,1,1,6,6,2,8,2,6,5,8,1,
        1,4,6,8,4,3,5,7,3,1,1,2,3,6,2,5,7,6,7,1,1,8,8,6,4,6,6,8,4,1,
        1,8,7,4,6,4,2,4,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,2,3,6,7,6,5,8,8,1,1,8,6,7,8,6,6,8,5,1,1,3,3,7,8,4,8,2,2,1,
        1,2,2,2,8,2,6,3,2,1,1,8,8,5,8,8,2,4,3,1,6,8,5,3,3,4,6,3,4,1,
        1,6,6,2,2,6,3,4,6,1,1,5,8,4,5,5,7,3,8,6,6,6,6,6,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,1,1,1,8,2,6,5,3,2,5,6,6,6,6,5,8,4,8,7,8,8,1,
        1,5,8,7,8,5,2,2,7,1,1,6,6,8,4,6,7,7,6,6,6,6,3,3,7,8,7,7,8,1,
        1,4,3,4,7,2,7,5,5,1,1,8,7,7,6,6,4,6,3,6,6,8,3,2,2,6,4,3,7,1,
        1,1,1,1,1,8,1,1,1,1,8,1,1,1,1,1,1,1,1,6,6,7,5,2,7,6,3,2,2,1,
        1,2,7,4,4,6,3,6,3,1,8,4,3,4,7,3,5,3,4,1,1,4,6,6,5,7,2,3,5,1,
        1,4,4,5,3,4,6,2,3,1,1,8,7,4,6,7,5,4,3,1,1,8,4,7,6,4,6,4,7,1,
        1,5,2,6,2,2,6,4,4,1,1,1,1,1,1,1,1,1,3,1,8,1,1,1,1,1,1,1,1,1,
        1,7,5,5,3,3,8,7,5,1,1,3,6,6,8,6,7,5,2,1,1,4,3,5,3,6,2,5,6,1,
        1,4,7,5,2,6,2,4,6,1,1,2,6,2,6,8,3,6,6,1,1,2,5,8,5,6,4,8,7,1,
        1,3,7,5,8,5,5,7,2,1,1,7,6,4,2,6,4,6,4,1,1,1,1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,1,1,1,3,8,7,3,4,8,8,4,1,1,7,6,3,6,2,2,6,6,1,
        1,7,5,4,4,6,2,5,3,1,1,5,5,6,6,6,3,3,3,1,1,2,3,3,5,8,2,8,5,1,
        1,3,2,4,5,8,4,2,6,1,1,8,8,5,5,7,5,5,7,1,1,5,6,8,8,4,4,7,2,1,
        1,1,1,1,1,1,1,1,1,8,8,8,8,8,8,1,1,1,1,1,1,5,5,6,7,4,5,6,4,1,
        1,6,8,8,5,5,5,2,2,1,1,4,8,4,2,4,2,3,3,1,1,3,4,5,4,4,5,3,6,1,
        1,7,3,4,8,4,2,3,4,1,1,4,2,3,8,4,3,2,3,1,1,6,2,7,3,2,7,6,8,1,
        1,8,5,6,2,2,7,8,8,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,4,7,6,7,2,2,3,7,1,1,2,8,6,5,6,4,8,2,1,1,5,7,7,8,5,3,3,4,1,
        1,4,2,3,2,2,4,2,2,1,1,7,4,4,8,3,4,3,8,1,1,2,5,7,8,6,2,6,6,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
    ];

    const onWheel = useCallback(e => {

        e.stopPropagation();
        if (e.deltaY < 0) {
            console.log('scrolling up event: ', e);
        }
        else if (e.deltaY > 0) {
            console.log('scrolling down event: ', e);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('wheel', onWheel);
    
        return () => {
          window.removeEventListener('wheel', onWheel);
        };
    }, [onWheel]);



    return (
        <Zoom zoom={25}>
            <IsometricMap 
                mapWidth={mapWidth} 
                mapHeight={mapHeight} 
                tileSize={tileSize} 
                slabSize={1}
                offsetY={offset}
            >
                {
                    mockedMap.map((tileId, index) => { // tileList
                        const x = index % mapWidth;
                        const y = Math.floor(index / mapWidth);
                        const result = [
                            <IsometricTile
                                key={`tile${index}`}
                                x={x}
                                y={y}
                                z={1}
                                frames={getFrames(true, tileId)}
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
