import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IsometricMap, IsometricTile } from '.';
import VisibilitySensor from 'react-visibility-sensor';

// Utils
import { 
    getFrames, 
    getRandomInt, 
    mockedMap, 
    playSFX, 
    getTileById,
} from '../../../utils';

// Components
import Objects from '../Objects';
import Units from '../Units';

// Sounds
import MapClick from '../../../assets/sound/map_click.ogg';

const GameMap = () => { 

    // map constants
    const mapWidth = 30;
    const mapHeight = 30;
    const tileSize = 42;

    // effects
    const { settings, isGameInit } = useSelector(state => state.game);
    const dispatch = useDispatch();

    const onMapLoaded = useCallback(isVisible => {
        if (isVisible) {
            dispatch({ type: 'MAP_LOADED' });
            dispatch({ type: 'LOADING_GAME', payload: getRandomInt(40, 60) })
        } else {
            dispatch({ type: 'MAP_LOADING' });
        }
    }, [dispatch]);

    const onMapClick = useCallback((x, y, id) => {
        playSFX(MapClick, settings.volume);
        dispatch({ type: 'MAP_CLICK', payload: {
            x: x, 
            y: y,
            data: getTileById(id),
        }})
    }, [dispatch, settings.volume]);

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
                    onClick={() => onMapClick(x, y, tileId)}
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

    return (
        <IsometricMap 
            mapWidth={mapWidth} 
            mapHeight={mapHeight} 
            tileSize={tileSize} 
            slabSize={1}
            offsetY={0}
            visibility={isGameInit ? 'visible' : 'hidden'}
        >
            <VisibilitySensor onChange={onMapLoaded}>
                <MapLoader />
            </VisibilitySensor>
        </IsometricMap>
    );
};

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

