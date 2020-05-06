import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { MapProvider, Map } from "./Map";
import IsometricMap, { IsometricTile, IsometricObject } from "react-isometric-tilemap";
import styled from "styled-components";
import "react-isometric-tilemap/build/css/index.css";

// Actions
import { 
    mapClick,
    dragMapMove, 
    dragMapStop 
} from '../../redux/map/actions';

// Utils
import utils from '../../utils';

// Graphic
// import floor63 from '../../assets/sprites/isometric_pixel_0063.png';
// import leftTop from '../../assets/sprites/left-top.png';
// import leftBottom from '../../assets/sprites/left-bottom.png';
// import leftMiddle from '../../assets/sprites/left-middle.png';
// import rightTop from '../../assets/sprites/right-top.png';
// import rightBottom from '../../assets/sprites/right-bottom.png';
// import rightMiddle from '../../assets/sprites/right-middle.png';

// Sounds
import MapClick from '../../assets/sound/map_click.ogg';

const GameMap = () => { 

    const mapWidth = 10;
    const mapHeight = 10;
    const tileSize = 42;
    const area = mapWidth * mapHeight;
    const tiles = Array.from(
        { length: area }, 
        (val, k) => (
            k <= mapWidth || 
            k.toString().indexOf('0') > -1 || 
            k.toString().indexOf('9', 1) > -1 || 
            k > area - mapWidth 
        ) ? val = 1 : val = 1
    );

    console.info("tiles: ", tiles);

    const frames = [{
        floor: require("../../assets/sprites/isometric_pixel_0063.png"), // floor63
        leftWall: {
          top: require("../../assets/sprites/left-top.png"),
          bottom: require("../../assets/sprites/left-bottom.png"),
          middle: require("../../assets/sprites/left-middle.png")
        },
        rightWall: {
          top: require("../../assets/sprites/right-top.png"),
          bottom: require("../../assets/sprites/right-bottom.png"),
          middle: require("../../assets/sprites/right-middle.png")
        }
    }];

    return (
        <IsometricMap 
            mapWidth={mapWidth} 
            mapHeight={mapHeight} 
            tileSize={tileSize} 
            slabSize={12}
        >
            {
               tiles.map((z, index) => {
                    const x = index % mapWidth;
                    const y = Math.floor(index / mapWidth);
                    const result = [
                        <IsometricTile
                            key={`tile${index}`}
                            x={x}
                            y={y}
                            z={z}
                            frames={frames}
                        />
                    ];
                    if (Math.random() < 0.1) {
                        result.push(
                            <IsometricObject
                                key={`object${index}`}
                                x={x}
                                y={y}
                                z={z}
                                width={85}
                                height={186}
                                frames={[require("../../assets/sprites/tree.png")]}
                                active
                            />
                        );
                    }
                    return result;
               }) 
            }
        </IsometricMap>
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
