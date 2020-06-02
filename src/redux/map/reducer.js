import { types } from './types';
import { initState } from './initState';

export default function mapReducer(state = initState, action) {
    switch (action.type) {

        case types.OBJECTS_CREATION_START: {
            return {
                ...state,
                isObjectsCreation: true,
            }
        }

        case types.OBJECTS_CREATED: {
            return {
                ...state,
                objectList: action.payload,
                isObjectsCreation: false,
                isObjectsCreated: true,
            }
        }

        case types.MAP_CLICK: {
            return {
                ...state,
                mapAction: {
                    x: action.payload.x,
                    y: action.payload.y,
                    data: action.payload.data,
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

        default:
            return state
    }
};