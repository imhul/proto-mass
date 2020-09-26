import React, { memo, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Selectors
import { getObjectByPositionSelector } from '../../../selectors/objects';
import { tasksSelector, pendingsSelector } from '../../../selectors/task';
import { isGameStartedSelector, isGamePausedSelector } from '../../../selectors/game';
import {
    unitsSelector,
    // getUnitByIdSelector,
} from '../../../selectors/units';
import { matrixSelector } from '../../../selectors/map';

// Components
import Stats from '../UI/Stats';
import Preloader from '../UI/Preloader';
import { AnimatedTexture } from '../Map';
import Notify from '../../Output/Notify';

// Utils
import { getPath, getLevel } from '../../../utils';
import chillout from 'chillout';

const Unit = memo(({ unitId, height, width }) => {

    // selectors
    const dispatch = useDispatch();
    const isGameStarted = useSelector(isGameStartedSelector);
    const isGamePaused = useSelector(isGamePausedSelector);
    const taskBoard = useSelector(tasksSelector);
    const pendingList = useSelector(pendingsSelector);
    const unitList = useSelector(unitsSelector);
    // const getUnitById = useSelector(getUnitByIdSelector);
    const getObject = useSelector(getObjectByPositionSelector);
    const matrix = useSelector(matrixSelector);
    // local state
    const [currentTask, setCurrentTask] = useState(null);
    const [unit, setUnit] = useState(null);

    

    // effects

    const taskSearch = useCallback(() => {

        const isUnitMatchTask = task => {
            const isUnitProfSuitable = unit && unit.professions.find(profession =>
                profession.name === task.profession &&
                profession.levelName === task.professionLevel &&
                unit.stats.level === task.level
            );
            return isUnitProfSuitable;
        }

        if (unitList &&
            unitList.length && 
            !unit.taskList.length
        ) {
            // Continue to work
            if (pendingList.length) {
                const currentTaskList = pendingList.filter(task =>
                    task.workerId === unit.id &&
                    task.status === "paused"
                );
                dispatch({
                    type: 'UNIT_GET_TASK_LIST', payload: {
                        taskList: currentTaskList,
                        userId: unit.id
                    }
                });
                dispatch({
                    type: 'TASK_CONTINUED', payload: {
                        taskList: currentTaskList,
                        unitId: unit.id
                    }
                });
                // New task accepting
            } else if (pendingList.length === 0 &&
                taskBoard.length &&
                !unit.taskList.length) {
                const relevantTaskList = taskBoard.filter(task =>
                    isUnitMatchTask(task) &&
                    task.status === "await"
                );
                if ((relevantTaskList && relevantTaskList.length) || (unit.taskList && unit.taskList.length)) {
                    dispatch({
                        type: 'TASK_ACCEPTED', payload: {
                            taskList: relevantTaskList,
                            unitId: unit.id
                        }
                    });
                    dispatch({
                        type: 'UNIT_GET_TASK_LIST', payload: {
                            taskList: relevantTaskList,
                            unitId: unit.id
                        }
                    });
                    // Go rest
                } else if (unit.status === "work") {
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
        unit,
        unitList,
        taskBoard,
        pendingList,
        dispatch
    ]);

    const walking = useCallback(() => {

        console.info("walking");
        let stepDelay;
        const newTask = unit.taskList.find(task => task.status = "accepted");
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

        function readyToWork(receivedTask) {
            if (path && path.length) {
                dispatch({
                    type: 'UNIT_READY_TO_WORK',
                    payload: {
                        currentTask: receivedTask,
                        unitId: unit.id,
                        unitPosition: unit.position,
                        unitPath: path,
                    }
                });
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
            chillout.forEach(path, function ({ x, y }, i) {
                if (x === unitPosX && y === unitPosY) {
                    stepDelay = setTimeout(() => dispatch({
                        type: 'UNIT_WALKING',
                        payload: {
                            x: currentTask && currentTask.path[i + 1] ? currentTask.path[i + 1].x : currentTask.path[i].x,
                            y: currentTask && currentTask.path[i + 1] ? currentTask.path[i + 1].y : currentTask.path[i].y,
                            unitId: unit.id,
                        }
                    }), 1000 * unit.stats.speed);
                }
            }).then(function () {
                if (((unitPosX + 1) === destination.x ||
                    (unitPosX - 1) === destination.x) ||
                    ((unitPosY + 1) === destination.y ||
                        (unitPosY - 1) === destination.y)
                ) {
                    // unit reached destination!
                    readyToWork(currentTask);
                    setCurrentTask(null);
                }
            });
        }
    }, [unit, currentTask, matrix, dispatch, getObject]);

    const working = useCallback(() => {
        console.info("working");

        let workingDelay;
        const workSpeed = 1000; // TODO: workSpeed must to become a selector
        const unitDamage = 10; // TODO: damage must to become a selector
        const unitXP = 10; // TODO: XP must to become a selector 
        const task = unit.currentTask;
        const currentProfession = unit.professions.find(prof =>
            prof.name === task.profession);
        const currentLevel = getLevel(
            currentProfession.level,
            currentProfession.progress
        );
        const { stats } = task.target;

        console.info("stats.damage: ", stats.damage);
        console.info("stats.health: ", stats.health);

        const workStep = () => {

            const isTaskComplete = task && stats &&
                task.status !== "complete" &&
                (task.status === "progress" || 
                task.status === "accepted") &&
                unit.status === "work" &&
                (stats.health === 0 || 
                stats.damage === stats.healthPoints || 
                stats.damage > stats.healthPoints ||
                stats.health < 0);

            if (isTaskComplete) {
                dispatch({
                    type: 'UNIT_TASK_COMPLETE',
                    payload: {
                        task: {
                            ...task,
                            status: "complete",
                        },
                        unitId: unit.id,
                    }
                });
                clearTimeout(workingDelay);
            } else {
                workingDelay = setTimeout(() => {
                    const newTargetStats = {
                        ...task.target.stats,
                        damage: !isTaskComplete ? stats.damage + unitDamage : stats.healthPoints,
                        health: !isTaskComplete ? stats.health - unitDamage : 0,
                    };

                    dispatch({
                        type: 'UNIT_TASK_PERFORMS',
                        payload: {
                            unitId: unit.id,
                            profession: {
                                ...currentProfession,
                                status: "update",
                                progress: currentProfession.progress + unitXP,
                                level: currentLevel.level,
                                pointsToNextLevel: currentLevel.pointsToNextLevel,
                            },
                            currentTask: {
                                ...task,
                                status: "progress",
                                target: {
                                    ...task.target,
                                    stats: newTargetStats,
                                }
                            },
                        }
                    });
                    dispatch({
                        type: 'OBJECT_DAMAGE',
                        payload: {
                            target: {
                                ...task.target,
                                stats: newTargetStats,
                                status: (stats.damage < stats.healthPoints) ? "damage" : "dead",
                                blocker: (stats.damage < stats.healthPoints) ? true : false,
                                width: (stats.damage < stats.healthPointsh) ? task.target.width : 0,
                                height: (stats.damage < stats.healthPoints) ? task.target.height : 0,
                            }
                        },
                    });
                }, workSpeed);
            }
        }

        if (task.status !== "complete" &&
            task.status !== "paused"
        ) {
            workStep();
        }
    }, [unit, dispatch]); // targetHealth, targetDamage, getUnitById, dispatch

    const rest = useCallback(() => {
        console.info("resting unit: ", unit);
        // TODO: Resting algorithm
    }, [unit]);

    const attak = useCallback(() => {
        console.info("fighting unit: ", unit);
        // TODO: Fighting algorithm
    }, [unit]);

    useEffect(() => {
        if (unitList && unitId && !unit) {
            const newUnit = unitList.find(uni => uni.id === unitId);
            // getUnitById(unitId);
            setUnit(newUnit);
        }
    }, [unitList, unitId, unit]);
    
    // Unit status check
    useEffect(() => {
        if (isGameStarted && !isGamePaused && unit) {
            switch (unit.status) {
                case "search": taskSearch();
                    break;
                case "walk": walking();
                    break;
                case "work": working();
                    break;
                case "rest": rest();
                    break;
                case "attak": attak();
                    break;
                default: break;
            }
        }
    }, [isGameStarted, isGamePaused, unit, taskSearch, walking, working, rest, attak]);

    const onAnimatedTextureClick = useCallback((x, y, data) => {
        // playSFX(MapClick, settings.volume);
        dispatch({
            type: 'USER_ACTION',
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
    const render = unit ? (
        <div
            key={`animated-unit-wrapper-${unit.name}`}
            className="react-isometric-object-wrapper active unit-wrapper"
            style={{
                '--x': unit.position.x,
                '--y': unit.position.y,
                '--z': 20,
                '--object-width': width,
                '--object-height': height,
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
                width={width}
                height={height}
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
    ) : null;

    return render

});

export default Unit;
