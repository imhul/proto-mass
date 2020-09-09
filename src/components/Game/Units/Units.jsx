import React, { memo, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import Stats from '../UI/Stats';
import Preloader from '../UI/Preloader';
import { AnimatedTexture } from '../Map';
import Notify from '../../Output/Notify';

// Selectors
import { fakePathSelector, getObjectByPositionSelector } from '../../../selectors/objects';
import { tasksSelector, pendingsSelector } from '../../../selectors/task';
import { isGameStartedSelector, isGamePausedSelector } from '../../../selectors/game';
import { unitsSelector, getUnitByIdSelector } from '../../../selectors/units';
import { matrixSelector } from '../../../selectors/map';

// Custom Hooks
import { useGetUnit, useGetTask } from '../../../hooks';

// Utils
import { getRandomInt, getPath, getLevel } from '../../../utils';

const Units = memo(props => {
    
    // selectors
    const dispatch = useDispatch();
    const isGameStarted = useSelector(isGameStartedSelector);
    const isGamePaused = useSelector(isGamePausedSelector);
    const taskBoard = useSelector(tasksSelector);
    const pendingList = useSelector(pendingsSelector);
    const unitList = useSelector(unitsSelector);
    const getUnitById = useSelector(getUnitByIdSelector);
    const fakePath = useSelector(fakePathSelector);
    const getObject = useSelector(getObjectByPositionSelector);
    const matrix = useSelector(matrixSelector);
    const [currentTask, setCurrentTask] = useState(null);
    const [isReadyToWork, setIsReadyToWork] = useState(false);

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
            // Continue to work
            if (pendingList.length) {
                const currentTaskList = pendingList.filter(task => 
                    task.workerId === unit.id &&
                    task.status === "paused"
                );
                dispatch({ type: 'UNIT_GET_TASK_LIST', payload: { 
                    taskList: currentTaskList,
                    userId: unit.id
                }});
                dispatch({ type: 'TASK_CONTINUED', payload: {
                    taskList: currentTaskList,
                    unitId: unit.id
                }});
            // New task accepting
            } else if (
                pendingList.length === 0 && 
                taskBoard.length && 
                !unit.taskList.length) 
            {
                const relevantTaskList = taskBoard.filter(task => 
                    isUnitProfessionMatchTask(unit, task) &&
                    task.status === "await"
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
                // Go rest
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

        let stepDelay;
        const newTask = taskList.find(task => task.status = "accepted");
        const unitPosX = unit.position.x;
        const unitPosY = unit.position.y;
        const destination = (newTask && 
            newTask.position && 
            (!currentTask || newTask.id !== currentTask.id)
        ) ? newTask.position : currentTask.position;
        const newPath = destination && getPath(matrix, unitPosY, unitPosX, destination.y, destination.x);
        
        if (newTask && newPath && (!currentTask || currentTask.id !== newTask.id)) {
            const target = getObject(newTask.position);
            setCurrentTask({
                ...newTask, 
                path: newPath,
                target: target,
            });
        } else clearTimeout(stepDelay);

        const path = currentTask && currentTask.path;

        function readyToWork(received) {
            if (path && path.length && !isReadyToWork) {
                 dispatch({
                    type: 'UNIT_READY_TO_WORK', 
                    payload: {
                        currentTask: received,
                        unitId: unit.id,
                    }
                });
                setIsReadyToWork(true);
                clearTimeout(stepDelay);
                Notify({
                    type: "success",
                    message: "TADAAAA!",
                    description: `Destination [x: ${destination.x},y: ${destination.y}]`,
                    icon: "success",
                    duration: 20
                });
            }
        } 

        console.info("isReadyToWork: ", isReadyToWork);

        if (currentTask &&
        destination &&
        destination.x &&
        unitPosX &&
        destination.y &&
        unitPosY &&
        !unit.currentTask &&
        unit.status === "walk"
        ) { 
        // unit ready to go!
            path.forEach(({x,y}, i) => {
                if (x === unitPosX && y === unitPosY) {
                    stepDelay = setTimeout(() => dispatch({
                        type: 'UNIT_WALKING',
                        payload: {
                            x: currentTask && currentTask.path[i+1] ? currentTask.path[i+1].x : currentTask.path[i].x,
                            y: currentTask && currentTask.path[i+1] ? currentTask.path[i+1].y : currentTask.path[i].y,
                            unitId: unit.id,
                        }
                    }), unit.stats.speed);
                } else {
                    if ( ((unitPosX + 1) === destination.x || 
                        (unitPosX - 1) === destination.x) && 
                    ((unitPosY + 1) === destination.y || 
                        (unitPosY - 1) === destination.y) 
                    ) {
                        // unit reached destination!
                        readyToWork(currentTask);
                        setCurrentTask(null);
                        
                    }
                }
            });
        }
    }, [ isReadyToWork, currentTask, matrix, dispatch, getObject ]);

    const working = useCallback((unit) => {
        let workingDelay;
        const workSpeed = 1000;
        const task = unit.currentTask;
        const currentProfession = unit.professions.find(prof => 
            prof.name === task.profession);
        const currentLevel = getLevel(
            currentProfession.level, 
            currentProfession.progress
        );
        const { id, stats } = task.target;

        const workStep = () => {
            dispatch({ 
                type: 'UNIT_TASK_PERFORMS',
                payload: {
                    unitId: unit.id,
                    profession: {
                        ...currentProfession,
                        status: "update",
                        progress: currentProfession.progress + 10,
                        level: currentLevel.level,
                        pointsToNextLevel: currentLevel.pointsToNextLevel,
                    },
                    currentTask: task,
                    status: "progress",
                }
            });
            dispatch({ 
                type: 'OBJECT_DAMAGE',
                payload: {
                    targetId: id,
                    damage: stats.damage + 10,
                },
            });
        }

        if (stats.lealth > 0 && 
            task.status !== "done" && 
            task.status !== "paused"
        ) {
            workingDelay = setTimeout(() => workStep(), workSpeed);
        } else {
            clearTimeout(workingDelay);
            dispatch({ 
                type: 'UNIT_TASK_COMPLETE',
                task: task,
            });
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
                    case "work": working(unit);
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
                zIndex: (unit.position && unit.position.x) ? unit.position.x + 10 : 50
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
