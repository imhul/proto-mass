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
import { getRandomInt, getMin } from '../../../utils';

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
    // const [ firstStepCount, setFirstStepCount ] = useState(0);

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
    useGetUnit(newUnit || newEnemy);
    useGetTask(fakeTask);

    // unit actions
    const taskSearch = useCallback(unit => {

        getUnitById(unit.id);

        const isUnitProfessionMatchTask = (unit, task) => {
            const unitProfessionsList = unit.professions;
            const taskProfession = task && task.profession;
            const whoIsPro = unitProfessionsList.filter(profession => profession.name === taskProfession);
            return whoIsPro.length > 0
        };
        
        if (unitList.length && !unit.taskList.length) {
            if (pendingList.length) {
                const currentTaskList = pendingList.filter(task => 
                    task.workerId === unit.id
                );
                dispatch({ type: 'UNIT_GET_TASK_LIST', payload: { 
                    taskList: currentTaskList,
                    userId: unit.id
                }});
                dispatch({ type: 'TASK_CONTINUED', payload: {
                    taskList: currentTaskList,
                    unitId: unit.id
                }});
            } else if (
                pendingList.length === 0 && 
                taskBoard.length && 
                !unit.taskList.length) 
            {
                const relevantTaskList = taskBoard.filter(task => 
                    isUnitProfessionMatchTask(unit, task)
                );
                if (relevantTaskList && relevantTaskList.length) {
                    dispatch({ type: 'UNIT_GET_TASK_LIST', payload: { 
                        taskList: relevantTaskList, 
                        unitId: unit.id
                    }});
                    dispatch({ type: 'TASK_ACCEPTED', payload: {
                        taskList: relevantTaskList,
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

    const walking = useCallback((taskList, unit) => {

        (!isGamePaused && unit.status === "walk" ) &&
        taskList.map(task => {

            let firstStepDelay;
            let secondStepDelay;
            const unitPosX = unit.position.x;
            const unitPosY = unit.position.y;
            const destination = task.position;

            const collisionAvoidance = (n, forwardX, forwardY, firstLine, secondLine) => {

                if (n > 0) {
                    if (firstLine && firstLine.length && !secondLine) {
                        console.info("collision on first step: ", firstLine);
                        clearTimeout(firstStepDelay);
                        const stepsToDestinationX = destination.x - unitPosX;
                        const stepsToDestinationY = destination.y - unitPosY;
                        const shortestWay = stepsToDestinationX > stepsToDestinationY ? "wayA" : "wayB";
                        const collisions = objectList.filter(obj => 
                            obj && obj.blocker && 
                            forwardX && 
                            forwardY &&
                            obj.position.x === forwardX &&
                            obj.position.y === forwardY
                        );
                        
                        switch(firstLine) {
    
                            case "down":
                                // try to go wayA
                                if (shortestWay === "wayA") {
                                    if (collisions.length < 1) {
                                        firstStepDelay = setTimeout(() => dispatch({ 
                                            type: 'UNIT_WALKING', 
                                            payload: {
                                                x: unitPosX,
                                                y: unitPosY + 1,
                                                unitId: unit.id,
                                            },
                                            meta: "down left Y+",
                                        }), unit.stats.speed);
                                    } else {
                                        collisionAvoidance(stepsToDestinationY - 1, forwardX, forwardY, "down")
                                    }
                                // try to go wayB
                                } else if (shortestWay === "wayB") {
                                    if (collisions.length < 1) {
                                        firstStepDelay = setTimeout(() => dispatch({ 
                                            type: 'UNIT_WALKING', 
                                            payload: {
                                                x: unitPosX + 1,
                                                y: unitPosY,
                                                unitId: unit.id,
                                            },
                                            meta: "down right X+",
                                        }), unit.stats.speed);
                                    } else {
                                        collisionAvoidance(stepsToDestinationX - 1, forwardX, forwardY, "down")
                                    }
                                }
                                break;
    
                            case "left":
                                // try to go wayA
                                if (shortestWay === "wayA") {
                                    if (collisions.length < 1) {
                                        firstStepDelay = setTimeout(() => dispatch({ 
                                            type: 'UNIT_WALKING', 
                                            payload: {
                                                x: unitPosX,
                                                y: unitPosY + 1,
                                                unitId: unit.id,
                                            },
                                            meta: "left left Y+",
                                        }), unit.stats.speed);
                                    } else {
                                        collisionAvoidance(stepsToDestinationY - 1, forwardX, forwardY, "left")
                                    }
                                // try to go wayB
                                } else if (shortestWay === "wayB") {
                                    if (collisions.length < 1) {
                                        firstStepDelay = setTimeout(() => dispatch({ 
                                            type: 'UNIT_WALKING', 
                                            payload: {
                                                x: unitPosX - 1,
                                                y: unitPosY,
                                                unitId: unit.id,
                                            },
                                            meta: "left right X-",
                                        }), unit.stats.speed);
                                    } else {
                                        collisionAvoidance(stepsToDestinationX - 1, forwardX, forwardY, "left")
                                    }
                                }
                                break;
    
                            case "right":
                                // try to go wayA
                                if (shortestWay === "wayA") {
                                    if (collisions.length < 1) {
                                        firstStepDelay = setTimeout(() => dispatch({ 
                                            type: 'UNIT_WALKING', 
                                            payload: {
                                                x: unitPosX,
                                                y: unitPosY - 1,
                                                unitId: unit.id,
                                            },
                                            meta: "right left Y-",
                                        }), unit.stats.speed);
                                    } else {
                                        collisionAvoidance(stepsToDestinationY - 1, forwardX, forwardY, "right")
                                    }
                                // try to go wayB
                                } else if (shortestWay === "wayB") {
                                    if (collisions.length < 1) {
                                        firstStepDelay = setTimeout(() => dispatch({ 
                                            type: 'UNIT_WALKING', 
                                            payload: {
                                                x: unitPosX + 1,
                                                y: unitPosY,
                                                unitId: unit.id,
                                            },
                                            meta: "right right X+",
                                        }), unit.stats.speed);
                                    } else {
                                        collisionAvoidance(stepsToDestinationX - 1, forwardX, forwardY, "right")
                                    }
                                }
                                break;
    
                        case "up":
                            // try to go wayA
                            if (shortestWay === "wayA") {
                                if (collisions.length < 1) {
                                    firstStepDelay = setTimeout(() => dispatch({ 
                                        type: 'UNIT_WALKING', 
                                        payload: {
                                            x: unitPosX,
                                            y: unitPosY - 1,
                                            unitId: unit.id,
                                        },
                                        meta: "up left Y-",
                                    }), unit.stats.speed);
                                } else {
                                    collisionAvoidance(stepsToDestinationY - 1, forwardX, forwardY, "up")
                                }
                            // try to go wayB
                            } else if (shortestWay === "wayB") {
                                if (collisions.length < 1) {
                                    firstStepDelay = setTimeout(() => dispatch({ 
                                        type: 'UNIT_WALKING', 
                                        payload: {
                                            x: unitPosX - 1,
                                            y: unitPosY,
                                            unitId: unit.id,
                                        },
                                        meta: "up right X-",
                                    }), unit.stats.speed);
                                } else {
                                    collisionAvoidance(stepsToDestinationX - 1, forwardX, forwardY, "up")
                                }
                            }
                            break;
                            default: break;
                        }
                    } else if (firstLine && secondLine && firstLine.length && secondLine.length) {
                        console.info("collision on second step: ", `${firstLine} ${secondLine}`);
                    }
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
                    const stepsToSecondLineY = destination.y - unitPosY;
                    const stepsToSecondLineX = destination.x - unitPosX;
                    const stepsToSecondLine = getMin(stepsToSecondLineY, stepsToSecondLineX);
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
                        // COLLISION!
                        collisionAvoidance(stepsToSecondLine, forwardX, forwardY, "down")
                    }
                }
                // go left
                else if (destination.y > unitPosY && destination.x < unitPosX && !isGamePaused) {
                    setDirection("left");
                    const forwardX = unitPosX - 1;
                    const forwardY = unitPosY + 1;
                    const stepsToSecondLineY = destination.y - unitPosY;
                    const stepsToSecondLineX = unitPosX - destination.x;
                    const stepsToSecondLine = getMin(stepsToSecondLineY, stepsToSecondLineX);
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
                        // COLLISION!
                        collisionAvoidance(stepsToSecondLine, forwardX, forwardY, "left")
                    }
                }
                // go right
                else if (destination.y < unitPosY && destination.x > unitPosX && !isGamePaused) {
                    setDirection("right");
                    const forwardX = unitPosX + 1;
                    const forwardY = unitPosY - 1;
                    const stepsToSecondLineY = unitPosY - destination.y;
                    const stepsToSecondLineX = destination.x - unitPosX;
                    const stepsToSecondLine = getMin(stepsToSecondLineY, stepsToSecondLineX);
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
                        // COLLISION!
                        collisionAvoidance(stepsToSecondLine, forwardX, forwardY, "right")
                    }
                }
                // go up
                else if (destination.y < unitPosY && destination.x < unitPosX && !isGamePaused) {
                    setDirection("up");
                    const forwardX = unitPosX - 1;
                    const forwardY = unitPosY - 1;
                    const stepsToSecondLineY = unitPosY - destination.y;
                    const stepsToSecondLineX = unitPosX - destination.x;
                    const stepsToSecondLine = getMin(stepsToSecondLineY, stepsToSecondLineX);
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
                        // COLLISION!
                        collisionAvoidance(stepsToSecondLine, forwardX, forwardY, "up")
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
                    // TODO: It is necessary to add a condition under which, if the unit is ready for work but does not have a list of tasks!
                    if (unit.status === "walk") {
                        dispatch({ type: 'UNIT_READY_TO_WORK', payload: { 
                            taskList: taskList,
                            unitId: unit.id
                        }});
                    }
                // ready to go
                } else if (!isGamePaused) firstStep();
            }
            return destination
        })
    }, [isGamePaused, dispatch, direction, objectList]);

    const working = useCallback((taskList, unit) => {
        let workingDelay;

        taskList.map(task => {
            if (task.progress < task.progressPoints && task.status !== "done" && task.status !== "paused") {
                workingDelay = setTimeout(() => dispatch({ 
                    type: 'UNIT_TASK_PERFORMS',
                    payload: {
                        unitId: unit.id,
                        progress: task.progress + 1,
                    }
                }), 1000);
            } else if (unit.taskList.progress === unit.taskList.progressPoints) {
                dispatch({ type: 'UNIT_TASK_COMPLETE' });
                clearTimeout(workingDelay);
            } else {
                // TODO: consider this decision!
                clearTimeout(workingDelay);
            }
            return task
        });
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
    }, [ isGameStarted, isGamePaused, unitList.length, taskSearch, walking, working, rest ]);

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
