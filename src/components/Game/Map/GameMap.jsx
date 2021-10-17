import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// hooks
import { useGetTask } from '../../../hooks';

// Selectors
import { selectedUnitSelector } from '../../../selectors/units';
import {
    isGameStartedSelector,
    isGamePausedSelector,
    isMapLoadedSelector,
    getLoadingPercentSelector,
    isMapVisibleSelector,
    isGameInitSelector
} from '../../../selectors/game';

// Components
import { IsometricMap, IsometricTile } from '.';
import Objects from '../Objects';
import Units from '../Units';

// Utils
import VisibilitySensor from 'react-visibility-sensor';
import _ from 'lodash';
import {
    getFrames,
    getRandomInt,
    getMap,
    // playSFX,
    getTileByType
} from '../../../utils';

// Sounds
// import MapClick from '../../../assets/sound/map_click.ogg';

const GameMap = memo(() => {
    // map constants
    const mapWidth = 30;
    const mapHeight = 30;
    const tileSize = 42;

    // effects
    const dispatch = useDispatch();
    const loadingPercent = useSelector(getLoadingPercentSelector);
    const currentUnit = useSelector(selectedUnitSelector);
    const isGameStarted = useSelector(isGameStartedSelector);
    const isGamePaused = useSelector(isGamePausedSelector);
    const isMapLoaded = useSelector(isMapLoadedSelector);
    const isMapVisible = useSelector(isMapVisibleSelector);
    const isGameInit = useSelector(isGameInitSelector);

    const onTileClick = useCallback(
        (x, y, id) => {
            // playSFX(MapClick, settings.volume);
            // console.info('onTileClick id: ', id);
            const props = {
                limit: 1,
                tileId: id,
                currentUnit: !_.isEmpty(currentUnit) && currentUnit, // if unit is selected
                position: {
                    x: x,
                    y: y
                }
            };

            if (!_.isEmpty(props) && !_.isEmpty(currentUnit) && !currentUnit.freeMode)
                useGetTask(props);

            dispatch({
                type: 'USER_ACTION',
                payload: {
                    x: x,
                    y: y,
                    objectType: 'tile', // tile, object, unit
                    actionType: 'click', // click, hover, scroll, context
                    data: getTileByType(id)
                }
            });
        },
        [dispatch, currentUnit]
    );

    // render
    const MapLoader = () => {
        const loadMap = getMap.flat().map((tileId, index) => {
            // mocked getGround factory util
            const x = (index % mapWidth) + 1;
            const y = Math.floor(index / mapWidth) + 1;
            const result = [
                <IsometricTile
                    key={`tile${index}`}
                    x={x}
                    y={y}
                    z={1}
                    frames={getFrames(false, tileId)}
                    onClick={() => isGameStarted && !isGamePaused && onTileClick(x, y, tileId)}
                />
            ];
            return result;
        });
        loadMap.push(<Objects type="tree" key={`objects`} />);
        loadMap.push(<Units width={40} height={79} key={`units`} />);
        return loadMap;
    };

    const onMapLoaded = useCallback(
        isVisible => {
            if (
                (!isMapVisible && isVisible && !isMapLoaded) ||
                (loadingPercent > 1 && loadingPercent < 11)
            ) {
                dispatch({ type: 'MAP_LOADED', payload: getRandomInt(11, 21) });
            } else if (isMapVisible && !isMapLoaded) {
                dispatch({ type: 'MAP_LOADING', payload: getRandomInt(5, 11) });
            }
        },
        [loadingPercent, isMapVisible, isMapLoaded, dispatch]
    );

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
    );
});

export default GameMap;
