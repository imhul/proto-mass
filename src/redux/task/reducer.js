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
                taskLimit: state.taskLimit + 1,
            }

        case types.TASK_DONE:
            return {
                ...state,
                taskList: update(state.taskList, 
                    { $merge: [action.payload] } // TODO: ?
                ),
            }


        default:
            return state
    }
};