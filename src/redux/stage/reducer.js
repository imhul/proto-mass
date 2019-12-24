import { types } from './types';
import { initState } from './initState';

export default function stageReducer(state = initState, action) {
    switch (action.type) {

        case types.RESIZE: 
            return {
                ...state,
                size: {
                    width: action.payload.windowWidth,
                    height: action.payload.windowHeight,
                }
            }

        case types.FULLSCREEN: 
            return {
                ...state,
                isFullscreen: !state.isFullscreen,
            }

        default:
            return state
    }
};