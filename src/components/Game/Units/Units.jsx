import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedTexture from '../Map/AnimatedTexture';
import uuidv5 from 'uuid/v5';

// Utils
import { getRandomInt } from '../../../utils';

const Units = props => {
    
    // Effects
    const dispatch = useDispatch();
    const { taskList, pendingList } = useSelector(state => state.task);
    const { 
        unitsLimit, 
        unitList,
        isUnitStatsShown
    } = useSelector(state => state.unit);

    const getUnit = useCallback(() => {
        const idLength = new Array(16);
        const name = uuidv5(`bot#${getRandomInt(100, 1001)}`, idLength);
        const userId = uuidv5(name, idLength);
        const unit = {
            id: userId,
            name: name,
            status: "search", // walk, work, attak, rest, search, dead
            stats: {
                level: getRandomInt(0, 4),
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
            skills: [
                {
                    id: "",
                    name: "",
                    status: "",
                    progress: "", // x-points
                    level: 0, // max 20
                    levelName: "trainee", // medium, prime
                    pointsToNextLevel: 0, // x-points
                    bonus: {
                        id: "",
                        name: "",
                        value: 0,
                    },
                },
            ],
            technologies: [
                {
                    id: "",
                    name: "",
                    status: "",
                    progress: "", // x-points
                    level: 0, // max 20
                    levelName: "trainee", // medium, prime
                    pointsToNextLevel: 0, // x-points
                    bonus: {
                        id: "",
                        name: "",
                        value: 0,
                    },
                },
            ],
            professions: [
                {
                    id: "",
                    name: "constructor", // constructor, collector, protector, numerator
                    status: "",
                    progress: "", // x-points
                    level: 0, // max 20
                    levelName: "trainee", // medium, prime
                    pointsToNextLevel: 0, // x-points
                    bonus: {
                        id: "",
                        name: "",
                        value: 0,
                    },
                },
            ],
            // unit backpack items
            itemsStorage: [],
            // unit wear
            items: [ 
                {
                    id: "",
                    name: "",
                    type: "",
                    stats: {},
                },
            ],
        }; 

        if (unit && unitList < unitsLimit) {
            dispatch({ type: 'UNIT_CREATED', payload: unit });
        }
    }, [ dispatch, unitsLimit, unitList ]);

    const getTask = useCallback(() => {
        const idLength = new Array(16);
        const taskId = uuidv5(`task#${getRandomInt(100, 1001)}`, idLength);
        const task = {
            id: taskId,
            status: "await", // awayt, progress, paused, done
            level: 0,
            profession: "collector",
            professionLevel: "trainee",
        }; 

        const limit = taskList.filter(item => item.id === task.id);

        if (task && limit.length < 1 ) {
            dispatch({ type: 'TASK_ADD', payload: task });
        }
    }, [ dispatch, taskList ]);

    useEffect(() => getUnit(), [getUnit]);

    useEffect(() => getTask(), [getTask]);

    const getUnitProfessionName = useCallback((unit, profession) => {
        const professions = unit.professions;
        const profUnit = professions.filter(prof => prof.name === profession);
        return profUnit.length > 0
    }, []);

    const taskSearch = useCallback(unit => {
        if (unitList.length > 0) {
            if (pendingList.length > 0) {
                const currentTask = pendingList.filter(task => task.workerId === unit.id);
                dispatch({ type: 'UNIT_GET_TASK', payload: currentTask });
            } else if (pendingList.length === 0 && taskList.length > 0) {
                 const relevantTask = taskList.filter(task => getUnitProfessionName(unit, task.profession)); 
                 dispatch({ type: 'UNIT_GET_TASK', payload: relevantTask });
            }
        }
    }, [ unitList, taskList, pendingList, dispatch ]);
    
    const units = unitList.map(unit => (
        <div 
            key={`animated-unit-wrapper-${unit.name}`}
            className="react-isometric-object-wrapper active unit-wrapper"
            style={{
                '--x':unit.position.x, 
                '--y':unit.position.y, 
                '--z':20, 
                '--object-width':props.width, 
                '--object-height':props.height,
                zIndex: unit.position.x + 10
            }}
        >
            {
                isUnitStatsShown && <div className="unit-stats">
                    {JSON.stringify(unit.position)}
                </div>
            }
            {
                unit.status === "search" && taskSearch(unit)
            }
            <AnimatedTexture
                id={unit.id}
                width={props.width}
                height={props.height}
                onPointerEnter={() => dispatch({ type: 'UNIT_STATS_TOGGLE' })}
                onPointerLeave={() => dispatch({ type: 'UNIT_STATS_TOGGLE' })}
                delay={200}
                frames={[
                    require("../../../assets/sprites/animations/bot/bot_0_0.2s.png"),
                    require("../../../assets/sprites/animations/bot/bot_1_0.2s.png"),
                    require("../../../assets/sprites/animations/bot/bot_2_0.2s.png"),
                    require("../../../assets/sprites/animations/bot/bot_3_0.2s.png"),
                ]}
            />
        </div>
    ));

    return units
};

export default Units;
