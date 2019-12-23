import { types } from './types';
import { initState } from './initState';

export default function appReducer(state = initState, action) {
    switch (action.type) {

        // Loading
        case types.LOADING_GAME: {
            return {
                ...state,
                isLoad: true,
            }
        }

        default:
            return state
    }
};