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

        case types.OBSTACLE_MATRIX_LOADED: {
            return {
                ...state,
                map: action.payload.map,
                matrix: action.payload.matrix,
            }
        }

        case types.USER_ACTION: {
            return {
                ...state,
                userAction: action.payload,
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