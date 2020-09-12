import { types } from './types';
import { initState } from './initState';

// utils
// import update from 'immutability-helper';

export default function mapReducer(state = initState, action) {
    switch (action.type) {

        // objects actions
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

        case types.OBJECT_DAMAGE: {
            const { target } = action.payload;

            const updatedObjectList = state.objectList.map(obj => {
                if (obj.id !== target.id) {
                    return obj
                } else {
                    return {
                        ...obj,
                        ...target,
                    }
                }
            });
            
            return {
                ...state,
                objectList: updatedObjectList,
            };
        }

        // user actions
        case types.USER_ACTION: {
            return {
                ...state,
                userAction: action.payload,
            }
        }

        default:
            return state
    }
};