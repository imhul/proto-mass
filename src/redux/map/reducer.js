import { types } from './types';
import { initState } from './initState';

export default function mapReducer(state = initState, action) {
    switch (action.type) {

        case types.MAP_CLICK: {
            console.info("action.payload: ", action.payload);
            return {
                ...state,
                clickPosition: {
                    x: action.payload.data.global.x,
                    y: action.payload.data.global.y,
                },
            }
        }

        case types.MAP_DRAG_START: {
            console.info("action.payload: ", action.payload);
            return {
                ...state,
                isMoved: false,
                isClicked: true,
            }
        }

        case types.MAP_DRAG_MOVE: {
            console.info("action.payload: ", action.payload);
            return {
                ...state,
                isMoved: true,
                mapPosition: {
                    x: action.payload.data.global.x,
                    y: action.payload.data.global.y,
                },
            }
        }

        case types.MAP_DRAG_STOP: {
            console.info("action.payload: ", action.payload);
            return {
                ...state,
                isClicked: false,
                isMoved: false,
                mapPosition: {
                    x: action.payload.data.global.x,
                    y: action.payload.data.global.y,
                },
            }
        }

        default:
            return state
    }
};