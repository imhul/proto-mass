import { types } from './types';
import { initState } from './initState';

// utils
import update from 'immutability-helper';

export default function unitReducer(state = initState, action) {
    const currentUnit =
        action.payload && state.unitList.find(unit => unit.id === action.payload.unitId);

    switch (action.type) {
        // BORN
        case types.UNIT_CREATED:
            return {
                ...state,
                unitList: update(state.unitList, { $push: [action.payload] })
            };

        // LOAD
        case types.UNITS_LOAD:
            return {
                ...state,
                unitList: action.payload
            };

        // REST
        case types.UNIT_START_REST:
            const updateUnitStatusToRest = update(currentUnit, {
                status: { $set: 'rest' } // walk, work, attak, rest, search, dead
            });

            return {
                ...state,
                unitList: update(state.unitList, { $merge: [updateUnitStatusToRest] })
            };

        // WALK
        case types.UNIT_START_WALKING:
            const updateUnitStatusToWalk = update(currentUnit, {
                status: { $set: 'walk' } // walk, work, attak, rest, search, dead
            });

            return {
                ...state,
                unitList: update(state.unitList, { $merge: [updateUnitStatusToWalk] })
            };

        case types.UNIT_WALKING:
            const updateUnitWalkingPosition = update(currentUnit, {
                position: {
                    x: { $set: action.payload.x },
                    y: { $set: action.payload.y }
                }
            });

            return {
                ...state,
                unitList: update(state.unitList, { $merge: [updateUnitWalkingPosition] })
            };

        case types.UNIT_STOP_WALKING:
            const updateUnitStatusToStop = update(currentUnit, {
                status: { $set: action.payload } // walk, work, attak, rest, search, dead
            });

            return {
                ...state,
                unitList: update(state.unitList, { $merge: [updateUnitStatusToStop] })
            };

        // WORK
        case types.UNIT_GET_TASK_LIST:
            const relevantTaskList =
                action.payload &&
                action.payload.taskList &&
                action.payload.taskList.length &&
                action.payload.unitId &&
                action.payload.taskList.map(currentTask => {
                    return {
                        ...currentTask,
                        status: 'accepted',
                        workerId: action.payload.unitId
                    };
                });

            const updateUnitTask = update(currentUnit, {
                taskList: { $merge: relevantTaskList },
                status: { $set: 'walk' }
            });

            return {
                ...state,
                unitList: update(state.unitList, { $merge: [updateUnitTask] })
            };

        case types.UNIT_READY_TO_WORK:
            const updateUnitStatus = update(currentUnit, {
                currentTask: { $set: action.payload.currentTask },
                status: { $set: 'work' } // walk, work, attak, rest, search, dead
            });

            return {
                ...state,
                unitList: update(state.unitList, { $merge: [updateUnitStatus] })
            };

        case types.UNIT_TASK_PERFORMS:
            const { currentTask, profession } = action.payload;
            const updateUnitWorking = update(currentUnit, {
                currentTask: { $set: currentTask },
                professions: { $merge: [profession] }
            });

            return {
                ...state,
                unitList: update(state.unitList, { $merge: [updateUnitWorking] })
            };

        case types.UNIT_TASK_COMPLETE:
            const { task } = action.payload;
            task.status = 'complete';
            const newTaskList = currentUnit.taskList.filter(job => job.id !== task.id);
            const updateUnitTaskComplete = update(currentUnit, {
                status: { $set: newTaskList.length ? 'walk' : 'search' }, // walk, work, attak, rest, search, dead
                taskList: { $set: newTaskList },
                currentTask: { $set: newTaskList.length ? newTaskList[0] : null }
            });

            return {
                ...state,
                unitList: update(state.unitList, { $merge: [updateUnitTaskComplete] })
            };

        default:
            return state;
    }
}
