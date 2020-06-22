import React, { memo, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import Stats from '../UI/Stats';
import Preloader from '../UI/Preloader';
import { AnimatedTexture } from '../Map';

// hooks
import { useGetUnit, useGetTask } from '../../../hooks';

const Units = memo(props => {
    
    // Effects
    const dispatch = useDispatch();
    // const { user } = useSelector(state => state.auth);
    const { 
        isGameStarted,
        isGamePaused,
    } = useSelector(state => state.game);

    const {
        taskList, 
        pendingList,  
    } = useSelector(state => state.task);

    const { 
        unitList,
    } = useSelector(state => state.unit);

    const { 
        objectList,
    } = useSelector(state => state.map);

    const newUnit = { 
        name: `bot01101-${unitList.length + 1}`, 
        isEnemy: false,
    };

    const newEnemy = { 
        name: `enemy01101-${unitList.length + 1}`, 
        isEnemy: true,
    };
    
    // synthesizing
    useGetUnit(newUnit || newEnemy);
    useGetTask();

    // unit actions
    const taskSearch = useCallback(unit => {

        const isUnitProfessionMatchTask = (unit, task) => {
            const unitProfessionsList = unit.professions;
            const taskProfession = task.profession;
            const whoIsPro = unitProfessionsList.filter(prof => prof.name === taskProfession);
            return whoIsPro.length > 0
        };
        
        if (unitList.length > 0 && unit.task === null) {
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
        unitList, 
        taskList, 
        pendingList,
        dispatch
    ]);

    const [ direction, setDirection ] = useState("");

    const walking = useCallback((pathways, unit) => {

        !isGamePaused && pathways.map(destination => {
            let firstStepDelay;
            let secondStepDelay;
            const unitPosX = unit.position.x;
            const unitPosY = unit.position.y;

            const firstStep = isCollision => {
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
                        secondStep(true);
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
                        secondStep(true);
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
                        secondStep(true);
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
                        secondStep(true);
                    }
                } 
                // first line segment is done / start next line segment
                else {
                    clearTimeout(firstStepDelay);                   
                    secondStep(false);
                }
            };

            const secondStep = isCollision => {
                console.info("::::secondStep isCollision::::", isCollision);
                // stop prev step
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
                                firstStep(true);
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
                                firstStep(true);
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
                                firstStep(true);
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
                                firstStep(true);
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
                                firstStep(true);
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
                                firstStep(true);
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
                                firstStep(true);
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
                                firstStep(true);
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
                    dispatch({ type: 'UNIT_STOP_WALKING', });
                    if (unit.status === "walk") {
                        dispatch({ 
                            type: 'UNIT_START_WORKING',
                            payload: {
                                unitId: unit.id,
                                task: {
                                    status: "progress",
                                    progress: unit.task.progress < unit.task.progressPoints ? 
                                        unit.task.progress + 1 : 
                                        unit.task.progress,
                                }
                            }
                        });
                    }
                // ready to go
                } else if (!isGamePaused) firstStep(false);
            }
            return null
        })
    }, [isGamePaused, dispatch, direction, objectList]);

    const working = useCallback(task => {
        console.info("working with task: ", task)
    }, []);
    
    useEffect(() => {
        if (isGameStarted && !isGamePaused) { 
            unitList.map(unit => {
                switch(unit.status) {
                    case "search": taskSearch(unit);
                        break;
                    case "walk": walking(unit.task.positions, unit);
                        break;
                    case "work": working(unit.task);
                        break;
                    default: break;
                }
                return unit
            })
        }
    }, [ isGameStarted, isGamePaused, unitList, taskSearch, walking, working ]);

    const OnAnimatedTextureClick = useCallback((x, y, data) => {
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

    const OnAnimatedTextureHover = useCallback((x, y, data) => {
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
                onClick={() => OnAnimatedTextureClick(unit.position.x, unit.position.y, unit)}
                onPointerEnter={() => OnAnimatedTextureHover(unit.position.x, unit.position.y, unit)}
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
