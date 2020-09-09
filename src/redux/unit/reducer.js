import { types } from './types';
import { initState } from './initState';

// utils
import update from 'immutability-helper';

export default function unitReducer(state = initState, action) {

    const currentUnit = action.payload && 
        state.unitList.find(unit => 
            unit.id === action.payload.unitId);

    switch (action.type) {

        // BORN
        case types.UNIT_CREATED: 
            return {
                ...state,
                unitList: update(state.unitList, 
                    { $push: [action.payload] }
                ),
            }

        // LOAD
        case types.UNITS_LOAD: 
            return {
                ...state,
                unitList: action.payload,
            }

        // REST
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

        // WALK
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

        // WORK
        case types.UNIT_GET_TASK_LIST: 
            const relevantTaskList = (
                action.payload && 
                action.payload.taskList && 
                action.payload.unitId && 
                action.payload.taskList.length
            ) && action.payload.taskList.map(currentTask => {
                    return {
                        ...currentTask,
                        status: "accepted",
                        workerId: action.payload.unitId,
                    }
                });

            const updateUnitTask = update(currentUnit, {
                taskList: { $merge: relevantTaskList },
                status: { $set: "walk" }
            });

            return {
                ...state,
                unitList: update(state.unitList, 
                    { $merge: [updateUnitTask] }
                ),
            }

        case types.UNIT_READY_TO_WORK:
        
            const updateUnitStatus = update(currentUnit, {
                currentTask: { $set: action.payload.currentTask },
                status: { $set: "work" }, // walk, work, attak, rest, search, dead
            });

            return {
                ...state,
                unitList: update(state.unitList, 
                    { $merge: [updateUnitStatus] }
                ),
            }

        case types.UNIT_TASK_PERFORMS:
            const { payload } = action;
            const { currentTask, profession, status } = payload;
            
            const updateCurrentTask = update(currentTask, {
                status: { $set: status }, // await, accepted, done, paused, progress
            });

            // const { level, progress } = profession;
            // const updateCurrentProf = update(profession, {
            //     progress: { $set: progress },
            //     level: { $set: level }, // walk, work, attak, rest, search, dead
            //     professions: { $merge: updateCurrentProf },
            // });

            const updateUnitWorking = update(currentUnit, {
                taskList: { $merge: [updateCurrentTask] },
                status: { $set: "work" }, // walk, work, attak, rest, search, dead
                professions: { $merge: [profession] },
            });

            return {
                ...state,
                unitList: update(state.unitList, 
                    { $merge: [updateUnitWorking] }
                ),
            }

        default:
            return state
    }
};