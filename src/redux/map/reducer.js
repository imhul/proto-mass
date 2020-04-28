import { types } from './types';
import { initState } from './initState';

export default function mapReducer(state = initState, action) {
    switch (action.type) {

        case types.MAP_CLICK: {
            return {
                ...state,
                clickPosition: {
                    x: action.payload.data.global.x,
                    y: action.payload.data.global.y,
                },
            }
        }

        case types.MAP_DRAG_MOVE: {
            return {
                ...state,
                isDragg: true,
                mapPosition: {
                    x: action.payload.x,
                    y: action.payload.y,
                },
            }
        }

        case types.MAP_DRAG_STOP: {
            return {
                ...state,
                isDragg: false,
                mapPosition: {
                    x: action.payload.x,
                    y: action.payload.y,
                },
            }
        }

        default:
            return state
    }
};