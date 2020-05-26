import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatedTexture } from '../Map';
import uuidv5 from 'uuid/v5';

// Utils
import { getRandomInt } from '../../../utils';

const Units = props => {
    
    // Effects
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { isGameInit } = useSelector(state => state.game);

    const { 
        taskList, 
        pendingList, 
        taskLimit 
    } = useSelector(state => state.task);

    const { 
        unitsLimit, 
        unitList,
        isUnitStatsShown
    } = useSelector(state => state.unit);

    const getUnit = useCallback(() => {
        if (!user.save.units && user.save.units.length === 0) {
            const idLength = new Array(16);
            const name = uuidv5(`bot#${getRandomInt(100, 1001)}`, idLength);
            const profId = uuidv5(`task.profession#${getRandomInt(100, 1001)}`, idLength);
            const userId = uuidv5(name, idLength);
            const unit = {
                id: userId,
                name: name,
                status: "search", // walk, work, attak, rest, search, dead
                isEnemy: false,
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
                task: null,
                skills: [
                    {
                        id: "",
                        name: "",
                        status: "",
                        progress: 0, // x-points
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
                        id: profId,
                        name: "constructor", // constructor, collector, protector, numerator
                        status: "",
                        progress: "", // x-points
                        level: 1, // max 20
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
        }
    }, [ dispatch, unitsLimit, unitList, user ]);

    const getTask = useCallback(() => {
        const idLength = new Array(16);
        const taskId = uuidv5(`task#${getRandomInt(100, 1001)}`, idLength);
        const task = {
            id: taskId,
            status: "await", // await, progress, paused, done
            level: 0,
            type: "construct", // construct, collect, fight
            workerId: "",
            priority: 1,
            progress: 0, // from 0 to progressPoints
            progressPoints: 8,
            profession: "constructor",
            professionLevel: "trainee",
            positions: [
                {
                    x: 24, // getRandomInt(1, 31)
                    y: 24, // getRandomInt(1, 31)
                },
                {
                    x: 8, // getRandomInt(1, 31)
                    y: 12, // getRandomInt(1, 31)
                },
            ],
        }; 

        const copies = taskList.filter(item => item.id === task.id);

        if (task && copies.length < 1) {
            if (taskList.length < 1 || taskList.length > taskLimit) {
                dispatch({ type: 'TASK_ADD', payload: task });
            }
        }
        
    }, [ dispatch, taskList, taskLimit ]);

    useEffect(() => {
        // if (!user.save || !user.save.units || user.save.units.length === 0) getTask()
        getTask()
    }, [getTask, user]);

    useEffect(() => {
        // if (!user.save || !user.save.units || user.save.units.length === 0) getUnit()
        getUnit()
    }, [getUnit, user]);
    
    const isUnitProfessionMatchTask = useCallback((unit, task) => {
        const unitProfessionsList = unit.professions;
        const taskProfession = task.profession;
        const whoIsPro = unitProfessionsList.filter(prof => prof.name === taskProfession);
        return whoIsPro.length > 0
    }, []);

    const taskSearch = useCallback(unit => {
        if (unitList.length > 0 && unit.task === null && isGameInit) {
            if (pendingList.length > 0) {
                const currentTask = pendingList.filter(task => 
                    task.workerId === unit.id
                );
                dispatch({ type: 'UNIT_GET_TASK', payload: { 
                    task: currentTask, 
                    userId: unit.id
                }});
                dispatch({ type: 'TASK_CONTINUED', payload: {
                    taskId: currentTask.id,
                    unitId: unit.id
                }});
            } else if (
                pendingList.length === 0 && 
                taskList.length > 0 && 
                !unit.task) 
            {
                const relevantTask = taskList.filter(task => 
                    isUnitProfessionMatchTask(unit, task)
                ); 
                dispatch({ type: 'UNIT_GET_TASK', payload: { 
                    task: relevantTask, 
                    unitId: unit.id
                }});
                dispatch({ type: 'TASK_ACCEPTED', payload: {
                    taskId: relevantTask[0].id,
                    unitId: unit.id
                }});
            }
        }
    }, [ 
        isGameInit, 
        unitList, 
        taskList, 
        pendingList, 
        isUnitProfessionMatchTask, 
        dispatch
    ]);
    
    useEffect(() => {
        unitList.map(unit => unit.status === "search" && taskSearch(unit))
    }, [ taskSearch, unitList ]);

    const unitsRender = unitList.map(unit => (
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
            <AnimatedTexture
                id={unit.id}
                width={props.width}
                height={props.height}
                onClick={() => getTask()}
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

    return unitsRender
};

export default Units;
