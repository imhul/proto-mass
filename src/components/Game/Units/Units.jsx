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
        const newTask = taskList.filter(task => task.status = "accepted")[0];
        const unitPosX = unit.position.x;
        const unitPosY = unit.position.y;
        const destination = (newTask && newTask.position && (currentTask === null || newTask.id !== currentTask.id)) ? newTask.position : currentTask.position;
        const newPath = destination && getPath(matrix, unitPosY, unitPosX, destination.y, destination.x);

        if (newTask && newPath && currentTask === null) {
            setCurrentTask({...newTask, path: newPath});
        } else {
            clearTimeout(stepDelay);
        }

        currentTask && currentTask.path.forEach(({x,y}, i) => {
            if (destination &&
                destination.x &&
                unitPosX &&
                destination.y &&
                unitPosY) 
            {
                // unit reached destination
                if (
                    (currentTask.path.length === (i + 1)) &&
                    ((unitPosX + 1) === destination.x || (unitPosX - 1) === destination.x) && 
                    ((unitPosY + 1) === destination.y || (unitPosY - 1) === destination.y) && 
                    unit.status === "walk" && 
                    currentTask !== null
                ) {
                    clearTimeout(stepDelay);

                    const target = getObject(currentTask.position);
                    dispatch({
                        type: 'UNIT_READY_TO_WORK', payload: {
                            currentTask: {...currentTask, target: target},
                            unitId: unit.id,
                        }
                    });
                    console.info("target: ", target);
                    setCurrentTask(null);
                    Notify({
                        type: "success",
                        message: "TADAAAA!",
                        description: `Destination [x: ${destination.x},y: ${destination.y}], Unit Position [x: ${x},y: ${y}]`,
                        icon: "success",
                        duration: 20
                    });
                    return;
                // ready to go
                } else if (x === unitPosX && y === unitPosY) {
                    stepDelay = setTimeout(() => dispatch({
                        type: 'UNIT_WALKING',
                        payload: {
                            x: currentTask && currentTask.path[i+1] ? currentTask.path[i+1].x : currentTask.path[i].x,
                            y: currentTask && currentTask.path[i+1] ? currentTask.path[i+1].y : currentTask.path[i].y,
                            unitId: unit.id,
                        }
                    }), unit.stats.speed);
                }
            }
        });
    }, [ currentTask, matrix, dispatch, getObject ]);

    const working = useCallback((taskList, unit) => {
        let workingDelay;
        const task = unit.currentTask;
        const currentProfession = unit.professions.filter(prof => 
            prof.name === task.profession)[0];

        if (
            task.progress < task.progressPoints && 
            task.status !== "done" && 
            task.status !== "paused"
        ) {
            workingDelay = setTimeout(() => {
                const currentLevel = getLevel(currentProfession.level, currentProfession.progress);
                return dispatch({ 
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

                        // TODO:
                        // targetHP - (skillCoof *or+ (kickPower + toolPower - DebuffEffect) / 100 * (AllHP/100 * currentHP))
                        progress: task.progress + 1,
                        currentTask: task,
                    }
                })}, 1000);
        } else if (task.progress === task.progressPoints) {
            dispatch({ type: 'UNIT_TASK_COMPLETE' });
            clearTimeout(workingDelay);
        } else {
            // TODO: consider this decision!
            clearTimeout(workingDelay);
        }

        console.info("currentTask: ", task);
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
