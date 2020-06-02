import React, { memo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import IsometricObject from '../Map/IsometricObject';
import uuidv5 from 'uuid/v5';

// Utils
import { getRandomInt } from '../../../utils';

const Objects = memo(({ width, height, type }) => {

    const idLength = new Array(16);

    // Effects
    const dispatch = useDispatch();
    const { objectsLimit, objectList, isObjectsCreation } = useSelector(state => state.map);
    const { isMapLoaded } = useSelector(state => state.game);
    const { isFirstResize } = useSelector(state => state.stage);

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
        if (objectList.length === 0 && 
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
        const objects = Array.from(
            { length: objectsLimit }, 
            (val, k) => {
                const objectId = uuidv5(`object#${k}`, idLength);
                
                const obj = {
                    id: objectId,
                    type: type,
                    typeId: getRandomInt(1, 5),
                    status: "absent",
                    stats: {
                        health: 100,
                        damage: 0,
                        healthPoints: 100,
                    },
                    position: {
                        x: getRandomInt(1, 31),
                        y: getRandomInt(1, 31),
                        z: 1
                    }
                }; 
                return val = obj
            }
        );
        if (objects && 
            objects.length === objectsLimit && 
            objects.length > objectList.length && 
            isObjectsCreation) 
        {
            dispatch({ type: 'OBJECTS_CREATED', payload: objects });
            indicateDone();
        }
    }, [
        objectsLimit, 
        dispatch, 
        idLength, 
        isObjectsCreation, 
        objectList.length, 
        type,
        indicateDone
    ]);
    
    return objectList.map((obj) => 
        <IsometricObject
            key={`object${obj.id}`}
            x={obj.position.x}
            y={obj.position.y}
            z={obj.position.z}
            width={width}
            height={height}
            frames={[require(`../../../assets/sprites/object_${obj.typeId}.png`)]}
            active={true}
            style={{ zIndex: obj.position.x + 10 }}
        />
    )
});

export default Objects;