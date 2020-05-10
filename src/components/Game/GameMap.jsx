import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { MapProvider, Map } from "./Map";
import { IsometricMap, IsometricTile } from './Map';
import { Zoom } from 'react-scaling';

// Actions
import { 
    mapClick,
    dragMapMove, 
    dragMapStop,
    // mapScaleUp,
    // mapScaleDown,
} from '../../redux/map/actions';

// Utils
import { getFrames, getRandomInt, mockedMap, playSFX } from '../../utils';

// Components
import Objects from './Objects';

// Sounds
import MapClick from '../../assets/sound/map_click.ogg';

const GameMap = () => { 

    // map constants
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
    const { zoom, isDraggable } = useSelector(state => state.map);
    const { settings } = useSelector(state => state.game);
    const dispatch = useDispatch();

    const onWheel = useCallback(e => {
        if (e.deltaY < 0) {
            dispatch({ type: 'MAP_DECREASE'})
        } else if (e.deltaY > 0) {
            dispatch({ type: 'MAP_INCREASE'})
        }
    }, [dispatch]);

    const onKeydown = useCallback(e => {
        // console.info("e.code: ", e.code);
        // console.info("e.keyCode: ", e.keyCode);
        if (e.code === 'ControlLeft' && e.keyCode === 17 && !isDraggable) {
            dispatch({ type: 'MAP_IS_DRAGGABLE'})
        }
    }, [dispatch, isDraggable]);

    const onKeyup = useCallback(e => {
        if (e.code === 'ControlLeft' && e.keyCode === 17 && isDraggable) {
            dispatch({ type: 'MAP_NO_DRAGGABLE'})
        }
    }, [dispatch, isDraggable]);

    useEffect(() => {
        window.addEventListener('wheel', onWheel);
        window.addEventListener('keydown', onKeydown);
        window.addEventListener('keyup', onKeyup);
    
        return () => {
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('keydown', onKeydown);
            window.removeEventListener('keyup', onKeyup);
        };
    }, [onWheel, onKeydown, onKeyup]);

    const onMapClick = useCallback((x, y) => {
        playSFX(MapClick, settings.volume);
        dispatch({ type: 'MAP_CLICK', payload: {x: x, y: y} })
    }, [dispatch, settings.volume]);

    // render
    const MapLoader = () => {
        const loadMap = mockedMap.map((tileId, index) => { // tileList[]
            const x = index % mapWidth;
            const y = Math.floor(index / mapWidth);
            const result = [
                <IsometricTile
                    key={`tile${index}`}
                    x={x}
                    y={y}
                    z={1}
                    frames={getFrames(true, tileId)}
                    onClick={() => onMapClick(x, y)}
                />
            ];
            return result;
        });
        loadMap.push( 
            <Objects width={tileSize} height={92} key={`objects`} />
        );
        return loadMap
    };

    return (
        <Zoom 
            zoom={zoom} 
            style={{ 'cursor': isDraggable ? 'grab' : 'default' }}
        >
            <IsometricMap 
                mapWidth={mapWidth} 
                mapHeight={mapHeight} 
                tileSize={tileSize} 
                slabSize={1}
                offsetY={offset}
            >
                <MapLoader />
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

//     const onKeyUp = event => {
//         if (isFullscreen && event.code === 'KeyM') {
//             dispatch({ type: 'TOGGLE_DRAWER' });
//             dispatch({ type: 'TOGGLE_PAUSE_GAME' });
//         }
//     }

//     const onKeyDown = useCallback(event => {
//         console.info("event.code: ", event.code);
//         const step = 10;
//         let keysPressed = {};
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
