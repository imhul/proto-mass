import { types } from './types';
import { initState } from './initState';
import update from 'immutability-helper';

export default function taskReducer(state = initState, action) {
    switch (action.type) {

        case types.TASK_ADD:
            return {
                ...state,
                taskList: update(state.taskList, 
                    { $push: [action.payload] }
                ),
                // taskLimit: state.taskLimit + 1,
            }

        case types.TASK_ACCEPTED:
            const relevantTaskList = (action.payload && action.payload.taskList && action.payload.taskList.length) &&
                action.payload.taskList.map(currentTask => {
                    return {
                        ...currentTask,
                        status: "accepted",
                        workerId: action.payload.unitId,
                    }
                });

            return {
                ...state,
                taskList: update(state.taskList, 
                    { $merge: relevantTaskList }
                ),
            }

        case types.TASK_IN_PROGRESS:
            return {
                ...state,
                taskList: update(state.taskList, 
                    { $merge: [action.payload] } // TODO: 
                ),
            }

        case types.TASK_PAUSED:
            return {
                ...state,
                taskList: update(state.taskList, 
                    { $merge: [action.payload] } // TODO: 
                ),
            }

        case types.TASK_CONTINUED:
            return {
                ...state,
                taskList: update(state.taskList, 
                    { $merge: [action.payload] } // TODO: 
                ),
            }

        case types.TASK_COMPLETE:
            return {
                ...state,
                taskList: update(state.taskList, 
                    { $merge: [action.payload] } // TODO: 
                ),
            }

        case types.TASK_DISTROY:
            return {
                ...state,
                taskList: update(state.taskList, 
                    { $merge: [action.payload] } // TODO: 
                ),
            }

        default:
            return state
    }
};