import { types } from './types';
import { initState } from './initState';
import update from 'immutability-helper';

export default function unitReducer(state = initState, action) {
    const currentUnit = action.payload && 
        state.unitList.filter(unit => 
            unit.id === action.payload.unitId)[0];

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

        case types.UNIT_GET_TASK: 
            const task = action.payload.task[0];
            const updateTask = update(task, {
                status: { $set: "accepted" }, // accepted, await, progress, paused, done
                workerId: { $set: currentUnit.id },
            });

            const updateUnitTask = update(currentUnit, {
                    task: { $set: updateTask },
                    status: { $set: "walk" }
                }
            );

            return {
                ...state,
                unitList: update(state.unitList, 
                    { $merge: [updateUnitTask] }
                ),
            }

        case types.UNIT_START_WALKING: 
            return {
                ...state,
            }

        case types.UNIT_START_WORKING: 
            return {
                ...state,
            }

        case types.UNIT_WALKING: 
            const updateUnitPosition = update(currentUnit, {
                position: { 
                    x: { $set: action.payload.x },
                    y: { $set: action.payload.y },
                 },
            });

            return {
                ...state,
                unitList: update(state.unitList, 
                    { $merge: [updateUnitPosition] }
                ),
            }

        case types.UNIT_STOP_WALKING: 
            return {
                ...state,
                current: {
                    ...state.current,
                    status: 'stop',
                },
            }

        default:
            return state
    }
};