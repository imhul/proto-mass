import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IsometricMap, IsometricTile } from '.';

// Utils
import VisibilitySensor from 'react-visibility-sensor';
import { 
    getFrames, 
    getRandomInt, 
    mockedMap, 
    // playSFX, 
    getTileById,
} from '../../../utils';

// Components
import Objects from '../Objects';
import Units from '../Units';

// Sounds
// import MapClick from '../../../assets/sound/map_click.ogg';

const GameMap = memo(() => { 

    // map constants
    const mapWidth = 30;
    const mapHeight = 30;
    const tileSize = 42;

    // effects
    const { 
        // settings, 
        isGameInit, 
        isMapLoaded, 
        isMapVisible,
        loadingPercent,
        // isMapLoadingStarted
    } = useSelector(state => state.game);
    const dispatch = useDispatch();

    const onTileClick = useCallback((x, y, id) => {
        // playSFX(MapClick, settings.volume);
        dispatch({ type: 'USER_ACTION', payload: {
            x: x, 
            y: y,
            objectType: "tile", // tile, object, unit
            actionType: "click", // click, hover, scroll, context
            data: getTileById(id),
        }})
    }, [dispatch]);

    const onTileHover = useCallback((x, y, id) => {
        dispatch({ type: 'USER_ACTION', payload: {
            x: x, 
            y: y,
            objectType: "tile", // tile, object, unit
            actionType: "hover", // click, hover, scroll, context
            data: getTileById(id),
        }})
    }, [dispatch]);

    // render
    const MapLoader = () => {
        const loadMap = mockedMap.map((tileId, index) => { // mocked getGround factory util
            const x = index % mapWidth;
            const y = Math.floor(index / mapWidth);
            const result = [
                <IsometricTile
                    key={`tile${index}`}
                    x={x}
                    y={y}
                    z={1}
                    frames={getFrames(true, tileId)}
                    onClick={() => onTileClick(x, y, tileId)}
                    onPointerEnter={() => onTileHover(x, y, tileId)}
                />
            ];
            return result;
        });
        loadMap.push( 
            <Objects width={72} height={65} type="tree" key={`objects`} />
        );
        loadMap.push(
            <Units width={40} height={79} key={`units`} />
        );
        return loadMap
    };

    const onMapLoaded = useCallback(isVisible => {
        console.info("isVisible: ", isVisible);
        if ((!isMapVisible && isVisible && !isMapLoaded) || (loadingPercent > 1 && loadingPercent < 11)) {
            dispatch({ type: 'MAP_LOADED', payload: getRandomInt(11, 21) });
        } else if (isMapVisible && !isMapLoaded) {
            dispatch({ type: 'MAP_LOADING', payload: getRandomInt(5, 11) });
        }
    }, [loadingPercent, isMapVisible, isMapLoaded, dispatch]);

    return (
        <VisibilitySensor onChange={onMapLoaded}>
            <IsometricMap 
                mapWidth={mapWidth} 
                mapHeight={mapHeight} 
                tileSize={tileSize} 
                slabSize={1}
                offsetY={0}
                visibility={isGameInit ? 'visible' : 'hidden'}
            >  
                <VisibilitySensor onChange={onMapLoaded} delayedCall={true}>
                    <MapLoader />
                </VisibilitySensor>
            </IsometricMap>
        </VisibilitySensor>
    )
});

export default GameMap;


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

