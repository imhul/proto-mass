import { types } from './types';
import { initState } from './initState';
import update from 'immutability-helper';

export default function unitReducer(state = initState, action) {

    const currentUnit = action.payload && 
        state.unitList.filter(unit => 
            unit.id === action.payload.unitId)[0];

    const task = (action.payload && action.payload.task && action.payload.task.length > 0) ? action.payload.task[0] : {};

    switch (action.type) {

        case types.UNIT_CREATED: 
            return {
                ...state,
                unitList: update(state.unitList, 
                    { $push: [action.payload] }
                ),
            }

        case types.UNITS_LOAD: 
            return {
                ...state,
                unitList: action.payload,
            }

        case types.UNIT_START_REST:
            const updateUnitStatusToRest = update(currentUnit, {
                status: { $set: "rest" } // walk, work, attak, rest, search, dead
            });

            return {
                ...state,
                unitList: update(state.unitList, 
                    { $merge: [updateUnitStatusToRest] }
                ),
            }

        case types.UNIT_GET_TASK: 
            const updateTaskStatusToAccepted = update(task, {
                status: { $set: "accepted" }, // accepted, await, progress, paused, done
                workerId: { $set: currentUnit.id },
            });

            const updateUnitTask = update(currentUnit, {
                task: { $set: updateTaskStatusToAccepted },
                status: { $set: "walk" }
            });

            return {
                ...state,
                unitList: update(state.unitList, 
                    { $merge: [updateUnitTask] }
                ),
            }

        case types.UNIT_START_WALKING: 
            const updateUnitStatusToWalk = update(currentUnit, {
                status: { $set: "walk" } // walk, work, attak, rest, search, dead
            });

            return {
                ...state,
                unitList: update(state.unitList, 
                    { $merge: [updateUnitStatusToWalk] }
                ),
            }

        case types.UNIT_TASK_ACCEPT: 
            const updateTaskStatusToProgress = update(task, {
                status: { $set: "progress" }, // accepted, await, progress, paused, done
                workerId: { $set: currentUnit.id },
            });

            const updateUnitTaskAndStatusToWork = update(currentUnit, {
                    task: { $set: updateTaskStatusToProgress },
                    status: { $set: "work" } // walk, work, attak, rest, search, dead
                }
            );

            return {
                ...state,
                unitList: update(state.unitList, 
                    { $merge: [updateUnitTaskAndStatusToWork] }
                ),
            }

        case types.UNIT_TASK_PERFORMS: 
            const updateUnitWorkingPoints = update(currentUnit, {
                task: { 
                    progress: { $set: action.payload.progress },
                },
            });

            return {
                ...state,
                unitList: update(state.unitList, 
                    { $merge: [updateUnitWorkingPoints] }
                ),
            }

        case types.UNIT_WALKING: 
            const updateUnitWalkingPosition = update(currentUnit, {
                position: { 
                    x: { $set: action.payload.x },
                    y: { $set: action.payload.y },
                 },
            });

            return {
                ...state,
                unitList: update(state.unitList, 
                    { $merge: [updateUnitWalkingPosition] }
                ),
            }

        case types.UNIT_STOP_WALKING: 
            const updateUnitStatusToStop = update(currentUnit, {
                status: { $set: action.payload } // walk, work, attak, rest, search, dead
            });

            return {
                ...state,
                unitList: update(state.unitList, 
                    { $merge: [updateUnitStatusToStop] }
                ),
            }

        default:
            return state
    }
};