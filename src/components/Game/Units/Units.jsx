import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedTexture from '../Map/AnimatedTexture';
import uuidv5 from 'uuid/v5';

// Utils
import { getRandomInt } from '../../../utils';
import { withFirebase } from '../../../utils/api';

const CreateUnits = props => {

    const idLength = new Array(16);
    
    // Effects
    const dispatch = useDispatch();
    const { totalUnits, createdUnits, unitList } = useSelector(state => state.unit);

    const onUnitCreate = useCallback(unit => {
        if (totalUnits < 2 && createdUnits === 0 && unitList < 2)
        dispatch({ type: 'UNIT_CREATED', payload: unit });
    }, [dispatch, totalUnits, createdUnits, unitList]);

    useEffect(() => {
        const unitZero = Array.from(
            { length: 1 }, 
            (val, k) => {
                const name = uuidv5(`bot#${k}`, idLength);
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
    }, [idLength, onUnitCreate]);
    
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