import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import IsometricObject from '../Map/IsometricObject';
import uuidv5 from 'uuid/v5';


// Utils
import { getRandomInt } from '../../../utils';

const Objects = ({ width, height, type }) => {

    const idLength = new Array(16);

    // Effects
    const dispatch = useDispatch();
    const { objectsLimit, objectList, isObjectsCreation } = useSelector(state => state.map);

    useEffect(() => {
        if (objectList.length === 0 && !isObjectsCreation) dispatch({ type: 'OBJECTS_CREATION_START' });
    }, [dispatch, isObjectsCreation, objectList.length]);

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
        }
        console.info("objects: ", objects);
    }, [objectsLimit, dispatch, idLength, isObjectsCreation, objectList.length, type]);
    
    return objectList.map((obj, index) => 
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
};

export default Objects;