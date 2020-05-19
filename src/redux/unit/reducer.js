import { types } from './types';
import { initState } from './initState';
import update from 'immutability-helper';

export default function unitReducer(state = initState, action) {
    switch (action.type) {

        case types.UNIT_STATS_TOGGLE:
            return {
                ...state,
                isUnitStatsShown: !state.isUnitStatsShown,
            }

        case types.UNIT_CREATED: 
            return {
                ...state,
                unitList: update(state.unitList, 
                    { $push: [action.payload] }
                ),
            }

        case types.UNIT_INIT_POSITION: 
            return {
                ...state,
                current: {
                    ...state.current,
                    status: 'search',
                    position: {
                        x: action.payload.x,
                        y: action.payload.y,
                    }
                },
            }

        case types.UNIT_START_WALKING: 
            return {
                ...state,
                current: {
                    ...state.current,
                    status: 'walk',
                },
            }

        case types.UNIT_WALKING: 
            return {
                ...state,
                current: {
                    ...state.current,
                    // status: 'walk',
                    position: {
                        x: action.payload.x,
                        y: action.payload.y,
                    }
                },
            }

        case types.UNIT_STOP_WALKING: 
            return {
                ...state,
                current: {
                    ...state.current,
                    status: 'stop',
                },
            }

        case types.UNIT_GET_TASK: 
            // const current = unitList[]
            return {
                ...state,
                // unitList: update(state.unitList, 
                //     { $push: [action.payload] }
                // ),
            }

        default:
            return state
    }
};