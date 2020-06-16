import React, { memo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch  } from 'react-redux';

// Components
import IsometricObject from '../Map/IsometricObject';

// Utils
import uuidv5 from 'uuid/v5';
import { 
    getRandomInt, 
    getObjectByType,
    // playSFX,
} from '../../../utils';

const Objects = memo(({ type }) => {

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
                    typeId: getRandomInt(1, 11),
                    status: "absent",
                    stats: {
                        health: 100,
                        damage: 0,
                        healthPoints: 100,
                    },
                    blocker: true,
                    position: {
                        x: getRandomInt(1, 31),
                        y: getRandomInt(1, 31),
                        z: 1
                    }
                }; 
                const copies = objectList.filter(item => 
                    item.position.x !== obj.position.x && 
                    item.position.y !== obj.position.y
                );
                return copies < 1 ? obj : val // or null
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
        objectList, 
        type,
        indicateDone
    ]);

    const onObjectClick = useCallback((x, y, id) => {
        // playSFX(MapClick, settings.volume);
        dispatch({ type: 'USER_ACTION', payload: {
            x: x, 
            y: y,
            objectType: "object",
            actionType: "click",
            data: getObjectByType(id),
        }})
    }, [dispatch]);

    const onObjectHover = useCallback((x, y, id) => {
        dispatch({ type: 'USER_ACTION', payload: {
            x: x, 
            y: y,
            objectType: "object",
            actionType: "hover",
            data: getObjectByType(id),
        }})
    }, [dispatch]);
    
    return objectList.map((obj) => {
        const height = getObjectByType(obj.typeId).height;
        const width = getObjectByType(obj.typeId).width;
        return <IsometricObject
            obj={obj}
            key={`object${obj.id}`}
            x={obj.position.x}
            y={obj.position.y}
            z={obj.position.z}
            width={width}
            height={height}
            frames={[require(`../../../assets/sprites/object_${obj.typeId}.png`)]}
            active={true}
            style={{ zIndex: obj.position.x + 10 }}
            onClick={() => onObjectClick(obj.position.x, obj.position.y, obj.typeId)}
            onPointerEnter={() => onObjectHover(obj.position.x, obj.position.y, obj.typeId)}
        />
    })
});

export default Objects;