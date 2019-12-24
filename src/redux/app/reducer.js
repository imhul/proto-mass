import { types } from './types';
import { initState } from './initState';

export default function appReducer(state = initState, action) {
    switch (action.type) {

        case types.APP_INIT: {
            return {
                ...state,
                isAppInit: true,
            }
        }

        case types.START_LOADING_APP: {
            return {
                ...state,
                isAppLoad: true,
            }
        }

        case types.LOADING_APP_COMPLETE: {
            return {
                ...state,
                isAppLoad: false,
            }
        }

        default:
            return state
    }
};