import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedTexture from '../Map/AnimatedTexture';
import uuidv5 from 'uuid/v5';

// Utils
import { getRandomInt } from '../../../utils';
import { withFirebase } from '../../../utils/api';

const CreateUnits = props => {

    // Effects
    const dispatch = useDispatch();
    const { totalUnits, createdUnits, unitList } = useSelector(state => state.unit);

    const onUnitCreate = useCallback(unit => {
        if (totalUnits < 4 && createdUnits === 0 && unitList < 4)
        dispatch({ type: 'UNIT_CREATED', payload: unit });
    }, [totalUnits, createdUnits, unitList]);

    useEffect(() => {
        // firebase.initializeApp();
        // const users = firebase.firestore().collection('users');
        // console.info('firebase: ', firebase);

        const unitsZero = Array.from(
            { length: 3 }, 
            (val, k) => {
                const nameLength = new Array(getRandomInt(3, 7));
                const idLength = new Array(16);
                const name = uuidv5(`bot#${k}`, idLength, null, nameLength);
                const userId = uuidv5(name, idLength);
                
                const unit = {
                    id: userId,
                    name: name,
                    status: "absent",
                    stats: {
                        level: getRandomInt(0, 4),
                        skills: [
                            {
                                id: "",
                                name: "",
                                status: "",
                                level: "",
                                pointsToNewLevel: 0,
                                bonus: {},
                            },
                        ],
                        health: 100,
                        damage: 0,
                        speed: 1.5,
                        healthPoints: 100,
                        pointsToNewLevel: 0,
                    },
                    position: {
                        x: getRandomInt(13, 18),
                        y: getRandomInt(13, 18),
                    },
                    technologies: [
                        {
                            id: "",
                            status: "",
                            progress: "",
                        },
                    ],
                    itemsStorage: [],
                    items: [
                        {
                            id: "",
                            name: "",
                            type: "",
                            stats: {},
                        },
                    ],
                }; 
        
                if (unit) {
                    onUnitCreate(unit);
                }
                return val = unit
            }
        );
    }, []);
    
    const staticList = unitList.map(unit => (
        <div 
            key={`animated-unit-wrapper-${unit.name}`}
            className="react-isometric-object-wrapper active unit-wrapper"
            style={{
                '--x':unit.position.x, 
                '--y':unit.position.y, 
                '--z':20, 
                '--object-width':props.width, 
                '--object-height':props.height
            }}
        >
            <AnimatedTexture
                id={unit.id}
                width={props.width}
                height={props.height}
                delay={200}
                frames={[
                    require("../../../assets/sprites/animations/bot/bot_0_0.2s.gif"),
                    require("../../../assets/sprites/animations/bot/bot_1_0.2s.gif"),
                    require("../../../assets/sprites/animations/bot/bot_2_0.2s.gif"),
                    require("../../../assets/sprites/animations/bot/bot_3_0.2s.gif"),
                ]}
            />
        </div>
    ));

    return (
        <>
            { staticList }
        </>
    )
    
};

const Units = withFirebase(CreateUnits);

export default Units;