import React, { memo, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import Stats from '../UI/Stats';
import Preloader from '../UI/Preloader';
import { AnimatedTexture } from '../Map';

// Selectors
import { objectsSelector, fakePathSelector } from '../../../selectors/objects';
import { tasksSelector, pendingsSelector } from '../../../selectors/task';
import { isGameStartedSelector, isGamePausedSelector } from '../../../selectors/game';
import { unitsSelector, getUnitByIdSelector } from '../../../selectors/units';

// Custom Hooks
import { useGetUnit, useGetTask } from '../../../hooks';

// Utils
import { getRandomInt } from '../../../utils';

const Units = memo(props => {
    
    // selectors
    const dispatch = useDispatch();
    const isGameStarted = useSelector(isGameStartedSelector);
    const isGamePaused = useSelector(isGamePausedSelector);
    const taskBoard = useSelector(tasksSelector);
    const pendingList = useSelector(pendingsSelector);
    const unitList = useSelector(unitsSelector);
    const getUnitById = useSelector(getUnitByIdSelector);
    const objectList = useSelector(objectsSelector);
    const fakePath = useSelector(fakePathSelector);

    // local state
    const [ direction, setDirection ] = useState("");

    // generators
    const newUnit = { 
        name: `bot01101-${unitList.length + 1}`, 
        isEnemy: false,
    };

    const newEnemy = { 
        name: `enemy01101-${unitList.length + 1}`, 
        isEnemy: true,
    };

    const fakeTask = {
        limit: 5,
        profession: "collector",
        type: "collect",
        position: fakePath[getRandomInt(0, 50)],
    };

    // effects

    // synthesizing
    const getUnit = useGetUnit(newUnit || newEnemy);
    const getTask = useGetTask(fakeTask);

    console.info("fakeTask: ", fakeTask);

    // unit actions
    const taskSearch = useCallback(unit => {

        getUnitById(unit.id);

        const isUnitProfessionMatchTask = (unit, task) => {
            const unitProfessionsList = unit.professions;
            const taskProfession = task.profession;
            const whoIsPro = unitProfessionsList.filter(profession => profession.name === taskProfession);
            return whoIsPro.length > 0
        };
        
        if (unitList.length > 0 && unit.taskList === null) {
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
                taskBoard.length && 
                !unit.taskList.length) 
            {
                const relevantTask = taskBoard.filter(task => 
                    isUnitProfessionMatchTask(unit, task)
                );
                if (relevantTask && relevantTask.length > 0) {
                    dispatch({ type: 'UNIT_GET_TASK', payload: { 
                        task: relevantTask, 
                        unitId: unit.id
                    }});
                    dispatch({ type: 'TASK_ACCEPTED', payload: {
                        taskId: relevantTask[0].id,
                        unitId: unit.id
                    }});
                } else {
                    // TODO: TimeMachine connect needed & stop after minute!
                    dispatch({ 
                        type: 'UNIT_START_REST', payload: {
                            unitId: unit.id,
                            // TODO: bonus to health restoration
                        }
                    });
                }
            }
        }
    }, [  
        unitList, 
        taskBoard, 
        pendingList,
        dispatch,
        getUnitById
    ]);

    const walking = useCallback((pathways, unit) => {

        (
            !isGamePaused && 
            unit.taskList.status !== "done" &&
            unit.taskList.status !== "paused" &&
            unit.status === "walk"
        ) && pathways.map(destination => {
            let firstStepDelay;
            let secondStepDelay;
            const unitPosX = unit.position.x;
            const unitPosY = unit.position.y;

            const collisionAvoidance = (firstLine, secondLine) => {
                if (firstLine.length && !secondLine) {
                    console.info("collision on first step!");
                } else {
                    console.info("collision on second step!");
                }
            };

            const firstStep = () => {
                // stop prev step
                clearTimeout(secondStepDelay);

                // go down
                if (destination.y > unitPosY && destination.x > unitPosX && !isGamePaused) {
                    setDirection("down");
                    const forwardX = unitPosX + 1;
                    const forwardY = unitPosY + 1;
                    const collisions = objectList.filter(obj => 
                        obj && obj.blocker && 
                        obj.position.x === forwardX &&
                        obj.position.y === forwardY
                    );
                    if (collisions.length < 1) {
                        firstStepDelay = setTimeout(() => dispatch({ 
                            type: 'UNIT_WALKING', 
                            payload: {
                                x: unitPosX + 1,
                                y: unitPosY + 1,
                                unitId: unit.id,
                            },
                            meta: "down X+ Y+",
                        }), unit.stats.speed);
                    } else {
                        console.info("::::collision down::::");
                        collisionAvoidance("down");
                    }
                }
                // go left
                else if (destination.y > unitPosY && destination.x < unitPosX && !isGamePaused) {
                    setDirection("left");
                    const forwardX = unitPosX - 1;
                    const forwardY = unitPosY + 1;
                    const collisions = objectList.filter(obj => 
                        obj && obj.blocker && 
                        obj.position.x === forwardX &&
                        obj.position.y === forwardY
                    );
                    if (collisions.length < 1) {
                        firstStepDelay = setTimeout(() => dispatch({ 
                            type: 'UNIT_WALKING', 
                            payload: {
                                x: unitPosX - 1,
                                y: unitPosY + 1,
                                unitId: unit.id,
                            },
                            meta: "left X- Y+",
                        }), unit.stats.speed);
                    } else {
                        console.info("::::collision left::::");
                        collisionAvoidance("left");
                    }
                }
                // go right
                else if (destination.y < unitPosY && destination.x > unitPosX && !isGamePaused) {
                    setDirection("right");
                    const forwardX = unitPosX + 1;
                    const forwardY = unitPosY - 1;
                    const collisions = objectList.filter(obj => 
                        obj && obj.blocker && 
                        obj.position.x === forwardX &&
                        obj.position.y === forwardY
                    );
                    if (collisions.length < 1) {
                        firstStepDelay = setTimeout(() => dispatch({ 
                            type: 'UNIT_WALKING', 
                            payload: {
                                x: unitPosX + 1,
                                y: unitPosY - 1,
                                unitId: unit.id,
                            },
                            meta: "right X+ Y-",
                        }), unit.stats.speed);
                    } else {
                        console.info("::::collision right::::");
                        collisionAvoidance("right");
                    }
                }
                // go up
                else if (destination.y < unitPosY && destination.x < unitPosX && !isGamePaused) {
                    setDirection("up");
                    const forwardX = unitPosX - 1;
                    const forwardY = unitPosY - 1;
                    const collisions = objectList.filter(obj => 
                        obj && obj.blocker && 
                        obj.position.x === forwardX &&
                        obj.position.y === forwardY
                    );
                    if (collisions.length < 1) {
                        firstStepDelay = setTimeout(() => dispatch({ 
                            type: 'UNIT_WALKING', 
                            payload: {
                                x: unitPosX - 1,
                                y: unitPosY - 1,
                                unitId: unit.id,
                            },
                            meta: "up X- Y-",
                        }), unit.stats.speed);
                    } else {
                        console.info("::::collision up::::");
                        collisionAvoidance("up");
                    }
                } 
                // first line segment is done / start next line segment
                else {
                    clearTimeout(firstStepDelay);                   
                    secondStep(false);
                }
            };

            const secondStep = () => {
                // stop prev step anyway!
                clearTimeout(firstStepDelay);

                let forwardX;
                let forwardY;

                const collisions = objectList.filter(obj => 
                    obj && obj.blocker && 
                    obj.position.x === forwardX &&
                    obj.position.y === forwardY
                );
                
                // next step
                switch(direction) {
                    case "down": 
                        forwardX = unitPosX + 1;
                        forwardY = unitPosY + 1;
                        
                        if (destination.x === unitPosX && !isGamePaused) {
                            if (collisions.length < 1) {
                                secondStepDelay = setTimeout(() => dispatch({
                                    type: 'UNIT_WALKING',  
                                    payload: {
                                        x: unitPosX,
                                        y: unitPosY + 1,
                                        unitId: unit.id,
                                    },
                                    meta: "down Y+",
                                }), unit.stats.speed)
                            } else {
                                console.info("::::collision secondStep down Y+::::");
                                collisionAvoidance("down", "Y+");
                            }
                        } else if (destination.y === unitPosY && !isGamePaused) {
                            if (collisions.length < 1) {
                                secondStepDelay = setTimeout(() => dispatch({
                                    type: 'UNIT_WALKING', 
                                    payload: {
                                        x: unitPosX + 1,
                                        y: unitPosY,
                                        unitId: unit.id,
                                    },
                                    meta: "down X+",
                                }), unit.stats.speed)
                            } else {
                                console.info("::::collision secondStep down X+::::");
                                collisionAvoidance("down", "X+");
                            }
                        }
                        break;
                    case "left": 
                        forwardX = unitPosX - 1;
                        forwardY = unitPosY + 1;
                        if (destination.x === unitPosX && !isGamePaused) {
                            if (collisions.length < 1) {
                                secondStepDelay = setTimeout(() => dispatch({
                                    type: 'UNIT_WALKING', 
                                    payload: {
                                        x: unitPosX,
                                        y: unitPosY + 1,
                                        unitId: unit.id,
                                    },
                                    meta: "left Y+",
                                }), unit.stats.speed)
                            } else {
                                console.info("::::collision secondStep left Y+::::");
                                collisionAvoidance("left", "Y+");
                            }
                        } else if (destination.x !== unitPosX && !isGamePaused) {
                            if (collisions.length < 1) {
                                secondStepDelay = setTimeout(() => dispatch({
                                    type: 'UNIT_WALKING', 
                                    payload: {
                                        x: unitPosX - 1,
                                        y: unitPosY,
                                        unitId: unit.id,
                                    },
                                    meta: "left X-",
                                }), unit.stats.speed)
                            } else {
                                console.info("::::collision secondStep left X-::::");
                                collisionAvoidance("left", "X-");
                            }
                        }
                        break;
                    case "right": 
                        forwardX = unitPosX + 1;
                        forwardY = unitPosY - 1;
                        if (destination.x === unitPosX && !isGamePaused) {
                            if (collisions.length < 1) {
                                secondStepDelay = setTimeout(() => dispatch({
                                    type: 'UNIT_WALKING', 
                                    payload: {
                                        x: unitPosX,
                                        y: unitPosY - 1,
                                        unitId: unit.id,
                                    },
                                    meta: "right Y-",
                                }), unit.stats.speed)
                            } else {
                                console.info("::::collision secondStep right Y-::::");
                                collisionAvoidance("right", "Y-");
                            }
                        } else if (destination.y === unitPosY && !isGamePaused) {
                            if (collisions.length < 1) {
                                secondStepDelay = setTimeout(() => dispatch({
                                    type: 'UNIT_WALKING',  
                                    payload: {
                                        x: unitPosX + 1,
                                        y: unitPosY,
                                        unitId: unit.id,
                                    },
                                    meta: "right X+",
                                }), unit.stats.speed)
                            } else {
                                console.info("::::collision secondStep right X+::::");
                                collisionAvoidance("right", "X+");
                            }
                        }
                        break;
                    case "up": 
                        forwardX = unitPosX - 1;
                        forwardY = unitPosY - 1;
                        if (destination.x === unitPosX && !isGamePaused) {
                            if (collisions.length < 1) {
                                secondStepDelay = setTimeout(() => dispatch({ 
                                    type: 'UNIT_WALKING', 
                                    payload: {
                                        x: unitPosX,
                                        y: unitPosY - 1,
                                        unitId: unit.id,
                                    },
                                    meta: "up Y-",
                                }), unit.stats.speed)
                            } else {
                                console.info("::::collision secondStep up Y-::::");
                                collisionAvoidance("up", "Y-");
                            }
                        } else if (destination.y === unitPosY && !isGamePaused) {
                            if (collisions.length < 1) {
                                secondStepDelay = setTimeout(() => dispatch({
                                    type: 'UNIT_WALKING', 
                                    payload: {
                                        x: unitPosX - 1,
                                        y: unitPosY,
                                        unitId: unit.id,
                                    },
                                    meta: "up X-",
                                }), unit.stats.speed)
                            } else {
                                console.info("::::collision secondStep up X-::::");
                                collisionAvoidance("up", "X-");
                            }
                        }
                        break;
                    default: 
                        clearTimeout(secondStepDelay);
                        break;
                }
            };

            if (destination.x && 
                unitPosX && 
                destination.y && 
                unitPosY) 
            {       
                // unit reached destination
                if (destination.x === unitPosX && destination.y === unitPosY) {
                    clearTimeout(secondStepDelay);

                    if (unit.status === "walk") {
                        dispatch({ type: 'UNIT_TASK_ACCEPT', payload: { 
                            userId: unit.id
                        }});
                    }
                // ready to go
                } else if (!isGamePaused) firstStep();
            }
            return destination
        })
    }, [isGamePaused, dispatch, direction, objectList]);

    const working = useCallback((task, unit) => {
        let workingDelay;
        if (unit.taskList.progress < unit.taskList.progressPoints) {
            workingDelay = setTimeout(() => dispatch({ 
                type: 'UNIT_TASK_PERFORMS',
                payload: {
                    unitId: unit.id,
                    progress: unit.taskList.progress + 1,
                }
            }), 1000);
        } else if (unit.taskList.progress === unit.taskList.progressPoints) {
            dispatch({ type: 'UNIT_TASK_COMPLETE' });
            clearTimeout(workingDelay);
        } else {
            clearTimeout(workingDelay);
        }
    }, [dispatch]);

    const rest = useCallback(unitId => {
        console.info("rest with unitId: ", unitId)
    }, []);
    
    // Unit status
    useEffect(() => {
        if (isGameStarted && !isGamePaused) { 
            unitList.map(unit => {
                switch(unit.status) {
                    case "search": taskSearch(unit);
                        break;
                    case "walk": walking(unit.taskList, unit);
                        break;
                    case "work": working(unit.taskList, unit);
                        break;
                    case "rest": rest(unit.id);
                        break;
                    default: break;
                }
                return unit
            })
        }
    }, [ isGameStarted, isGamePaused, unitList, taskSearch, walking, working, rest ]);

    const onAnimatedTextureClick = useCallback((x, y, data) => {
        // playSFX(MapClick, settings.volume);
        dispatch({ type: 'USER_ACTION', 
            payload: {
                x: x, 
                y: y,
                objectType: "unit",
                actionType: "click",
                data: data,
            }
        })
    }, [dispatch]);

    const onAnimatedTextureHover = useCallback((x, y, data) => {
        dispatch({ 
            type: 'USER_ACTION', 
            payload: {
                x: x,
                y: y,
                objectType: "unit",
                actionType: "hover",
                data: data
            }
        })
    }, [dispatch]);

    // render
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
            <Stats>
                { 
                    unit.stats.health === unit.stats.healthPoints ? 
                    `x:${JSON.stringify(unit.position.x)},y:${JSON.stringify(unit.position.y)}` : 
                            <Preloader 
                                percent={unit.stats.healthPoints} 
                                class="mini" 
                                strokeWidth={4} 
                                format={null} 
                            /> 
                }
            </Stats>

            <AnimatedTexture
                id={unit.id}
                width={props.width}
                height={props.height}
                onClick={() => onAnimatedTextureClick(unit.position.x, unit.position.y, unit)}
                onPointerEnter={() => onAnimatedTextureHover(unit.position.x, unit.position.y, unit)}
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
    
}, function areEqual(prevProps, nextProps) {
    /*
    возвращает true, если nextProps рендерит
    тот же результат что и prevProps,
    иначе возвращает false
    */
  });

export default Units;
