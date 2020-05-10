import { types } from './types';
import { initState } from './initState';

export default function mapReducer(state = initState, action) {
    switch (action.type) {

        case types.MAP_CLICK: {
            return {
                ...state,
                clickPosition: {
                    x: action.payload.x,
                    y: action.payload.y,
                },
            }
        }

        case types.MAP_INCREASE: {
            return {
                ...state,
                zoom: state.zoom < 250 ? state.zoom + 10 : state.zoom,
            }
        }

        case types.MAP_DECREASE: {
            return {
                ...state,
                zoom: state.zoom > 100 ? state.zoom - 10 : state.zoom,
            }
        }

        case types.MAP_IS_DRAGGABLE: {
            return {
                ...state,
                isDraggable: true,
            }
        }

        case types.MAP_NO_DRAGGABLE: {
            return {
                ...state,
                isDraggable: false,
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