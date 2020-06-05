import React, { memo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatedTexture } from '../Map';

// hooks
import { useGetUnit, useGetTask } from '../../../hooks';

// utils


const Units = memo(props => {
    
    // Effects
    const dispatch = useDispatch();
    // const { user } = useSelector(state => state.auth);
    const { 
        isGameStarted, 
    } = useSelector(state => state.game);

    const {
        taskList, 
        pendingList,  
    } = useSelector(state => state.task);

    const { 
        unitList,
        isUnitStatsShown
    } = useSelector(state => state.unit);

    const newUnit = { 
        name: `bot01101-${unitList.length + 1}`, 
        isEnemy: false,
    };

    // const newEnemy = { 
    //     name: `enemy01101-${unitList.length + 1}`, 
    //     isEnemy: true,
    // };
    
    // synthesizing
    useGetUnit(newUnit);
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

    const walking = useCallback((pathways, unit) => {
        dispatch({ 
            type: 'UNIT_START_WALKING', 
            payload: {
                path: pathways,
                unitId: unit.id,
                start: {
                    x: unit.position.x,
                    y: unit.position.y,
                },
            },
        });
        // const pathwaysCount = pathways.length;
        const go = pathways.map(destination => {
            const unitPosX = unit.position.x;
            const unitPosY = unit.position.y;
            if ((destination.x && 
                unitPosX && 
                destination.x !== unitPosX) ||
                (destination.y && 
                unitPosY &&
                destination.y !== unitPosY)) 
            {
                console.log("go!!!");
                // down
                if (destination.y > unitPosY && destination.x > unitPosX) {
                    console.log("go down");
                    if (destination.x !== unitPosX) {
                        dispatch({ 
                            type: 'UNIT_WALKING', 
                            payload: {
                                x: unitPosX,
                                y: unitPosY + 1,
                                unitId: unit.id,
                            },
                        })
                    } else if (destination.y !== unitPosY) {
                        dispatch({ 
                            type: 'UNIT_WALKING', 
                            payload: {
                                x: unitPosX + 1,
                                y: unitPosY,
                                unitId: unit.id,
                            },
                        })
                    } else {
                        dispatch({ 
                            type: 'UNIT_WALKING', 
                            payload: {
                                x: unitPosX + 1, 
                                y: unitPosY + 1,
                                unitId: unit.id,
                            },
                        })
                    }
                }
                // left
                else if (destination.y > unitPosY && destination.x < unitPosX) {
                    console.log("go left");
                    if (destination.x !== unitPosX) {
                        dispatch({ 
                            type: 'UNIT_WALKING', 
                            payload: {
                                x: unitPosX,
                                y: unitPosY + 1,
                                unitId: unit.id,
                            },
                        })
                    } else if (destination.y !== unitPosY) {
                        dispatch({ 
                            type: 'UNIT_WALKING', 
                            payload: {
                                x: unitPosX - 1,
                                y: unitPosY,
                                unitId: unit.id,
                            },
                        })
                    } else {
                        dispatch({ 
                            type: 'UNIT_WALKING', 
                            payload: {
                                x: unitPosX - 1, 
                                y: unitPosY + 1,
                                unitId: unit.id,
                            },
                        })
                    }
                }
                // right
                else if (destination.y < unitPosY && destination.x > unitPosX) {
                    console.log("go right");
                    if (destination.x !== unitPosX) {
                        dispatch({ 
                            type: 'UNIT_WALKING', 
                            payload: {
                                x: unitPosX,
                                y: unitPosY - 1,
                                unitId: unit.id,
                            },
                        })
                    } else if (destination.y !== unitPosY) {
                        dispatch({ 
                            type: 'UNIT_WALKING', 
                            payload: {
                                x: unitPosX + 1,
                                y: unitPosY,
                                unitId: unit.id,
                            },
                        })
                    } else {
                        dispatch({ 
                            type: 'UNIT_WALKING', 
                            payload: {
                                x: unitPosX + 1, 
                                y: unitPosY - 1,
                                unitId: unit.id,
                            },
                        })
                    }
                }
                // up
                else if (destination.y < unitPosY && destination.x < unitPosX) {
                    console.log("go up");
                    if (destination.x !== unitPosX) {
                        dispatch({ 
                            type: 'UNIT_WALKING', 
                            payload: {
                                x: unitPosX,
                                y: unitPosY - 1,
                                unitId: unit.id,
                            },
                        })
                    } else if (destination.y !== unitPosY) {
                        dispatch({ 
                            type: 'UNIT_WALKING', 
                            payload: {
                                x: unitPosX - 1,
                                y: unitPosY,
                                unitId: unit.id,
                            },
                        })
                    } else {
                        dispatch({ 
                            type: 'UNIT_WALKING', 
                            payload: {
                                x: unitPosX - 1, 
                                y: unitPosY - 1,
                                unitId: unit.id,
                            },
                        })
                    }
                } else {
                    console.log("STOP_WALKING [destination.x, unitPosX, destination.y, unitPosY]: ", destination.x, unitPosX, destination.y, unitPosY);
                }
            } else {
                console.log("UNIT_WALKING error [destination.x, unitPosX, destination.y, unitPosY]: ", destination.x, unitPosX, destination.y, unitPosY);
            }
            return null
        });
        // TODO: if (path === unitPosition) working()
    }, [dispatch]);

    const working = useCallback(task => {
        console.info("working with task: ", task)
    }, []);
    
    useEffect(() => {
        isGameStarted && unitList.map(unit => {
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
    }, [ isGameStarted, unitList, taskSearch, walking, working ]);

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
            {
                isUnitStatsShown && <div className="unit-stats">
                    {JSON.stringify(unit.position)}
                </div>
            }
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
