import React, { memo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch  } from 'react-redux';

// Components
import IsometricObject from '../Map/IsometricObject';

// Selectors
import { 
    matrixSelector, 
    mapArraySelector, 
    objectListSelector, 
    isObjectsCreationSelector
} from '../../../selectors/map';
import { isMapLoadedSelector } from '../../../selectors/game';
import { isFirstResizeSelector } from '../../../selectors/stage';

// Utils
import { v5 as uuidv5 } from 'uuid';
import { 
    getRandomInt, 
    getObjectByType,
    getMap,
    // playSFX,
} from '../../../utils';

const Objects = memo(() => {

    const idLength = new Array(16);
    const limit = 0.2;

    // Effects
    const dispatch = useDispatch();
    const mapArray = useSelector(mapArraySelector);
    const matrix = useSelector(matrixSelector);
    const objectList = useSelector(objectListSelector);
    const isObjectsCreation = useSelector(isObjectsCreationSelector);
    const isMapLoaded = useSelector(isMapLoadedSelector);
    const isFirstResize = useSelector(isFirstResizeSelector);

    const indicateStart = useCallback(() => {
        dispatch({ 
            type: 'LOADING_GAME_UPDATE', 
            payload: getRandomInt(31, 41),
            meta: "start creating objects"
        })
    }, [dispatch]);

    const indicateDone = useCallback(() => {
        dispatch({ 
            type: 'LOADING_GAME_UPDATE', 
            payload: getRandomInt(41, 51), 
            meta: "objects is created" 
        })
    }, [dispatch]);

    useEffect(() => {
        if (!objectList.length && 
            !isObjectsCreation && 
            isMapLoaded && 
            isFirstResize)
        {
            dispatch({ type: 'OBJECTS_CREATION_START' });
            indicateStart();
        }
    }, [
        dispatch, 
        isObjectsCreation, 
        objectList.length, 
        isMapLoaded,
        indicateStart,
        isFirstResize
    ]);

    useEffect(() => {
        if (!mapArray.length && !matrix.length) {
            const newMatrix = getMap.map(row => row.map(cell => cell !== 0 ? -1 : 0));
            dispatch({ 
                type: 'OBSTACLE_MATRIX_LOADED',
                payload: {
                    map: getMap,
                    matrix: newMatrix
                }
            });
        }
    }, [ mapArray, matrix, dispatch ]);

    useEffect(() => {
        const objects = getMap.flat().map((tileTypeId, index) => {
            const objectId = uuidv5(`object#${index}`, idLength);
            const treeId = getRandomInt(9, 12);
            const tree = getObjectByType(treeId);
            const mineral = getObjectByType(tileTypeId)
            const tileX = (index % 30) + 1;
            const tileY = Math.floor(index / 30) + 1;

            // generators
            const treeObject = {
                ...tree,
                id: objectId,
                position: {
                    x: getRandomInt(1, 31),
                    y: getRandomInt(1, 31),
                    z: 1
                },
            }

            const mineralObject = {
                ...mineral,
                id: objectId,
                position: {
                    x: tileX,
                    y: tileY,
                    z: 1,
                },
            }

            // logic
            const copies = objectList.filter(item => 
                item.position.x !== treeObject.position.x && 
                item.position.y !== treeObject.position.y &&
                item.id !== treeObject.id &&
                item.id !== mineralObject.id
            );
            if (!copies.length &&
                treeObject.position.x !== 15 &&
                treeObject.position.y !== 15 &&
                mineralObject.position.x !== 15 &&
                mineralObject.position.y !== 15 &&
                treeObject.position.x !== mineralObject.position.x &&
                treeObject.position.y !== mineralObject.position.y
            ) {
                if (Math.random() < limit && tileTypeId === 0) {
                    return treeObject
                } else if (tileTypeId !== 1) {
                    return mineralObject
                } else return null
            } else return null
        });

        if (objects && 
            objects.length > objectList.length && 
            isObjectsCreation) 
        {
            const filled = objects.filter(item => item !== null && item.typeId !== "");
            dispatch({ type: 'OBJECTS_CREATED', payload: filled });
            indicateDone();
        }
    }, [
        dispatch, 
        idLength, 
        isObjectsCreation,
        objectList, 
        indicateDone
    ]);

    const onObjectClick = useCallback(obj => {
        // playSFX(MapClick, settings.volume);
        dispatch({ type: 'USER_ACTION', payload: {
            x: obj.position.x, 
            y: obj.position.y,
            objectType: "object",
            actionType: "click",
            data: obj,
        }})
    }, [dispatch]);
    
    return objectList.map((obj) => {
        return obj !== null && <IsometricObject
            stats={true}
            obj={obj}
            key={obj.id}
            x={obj.position.x}
            y={obj.position.y}
            z={obj.position.z}
            width={obj.width}
            height={obj.height}
            frames={[require(`../../../assets/sprites/object_${obj.typeId}.png`)]}
            active={true}
            style={{ zIndex: obj.position.x + 10 }}
            onClick={() => onObjectClick(obj)}
        />
    })
});

export default Objects;