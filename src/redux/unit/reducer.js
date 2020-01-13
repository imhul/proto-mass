import { types } from './types';
import { initState } from './initState';

export default function unitReducer(state = initState, action) {
    switch (action.type) {

        case types.UNIT_CREATED: 
            return {
                ...state,
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

        default:
            return state
    }
};