import { types } from './types';
import { initState } from './initState';

// utils
import update from 'immutability-helper';

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
            const { target, damage } = action.payload;
            const targetObject = state.objectList.find(obj => obj.id === target.id);
            const { stats: { health, healthPoints } } = target;
            
            if (damage && health && (health === 0 || health < 0 || damage > health)) {
                const updateObjectDamage = update(targetObject, {
                    stats: { 
                        damage: { $set: healthPoints },
                        health: { $set: 0 }
                    },
                    status: { $set: "dead" }, // inactive, grow, damage, attack, repair, dead
                    blocker: { $set: false },
                    width: { $set: 0 },
                    height: { $set: 0 },
                });
                return {
                ...state,
                    objectList: update(state.objectList,
                        { $merge: [updateObjectDamage] }
                    ),
                }
            } else {
                const updateObjectDamage = update(targetObject, {
                    stats: { 
                        damage: { $set: damage },
                        health: { $set: (health - damage) }
                     },
                     status: { $set: "damage" }, // inactive, grow, damage, attack, repair, dead
                });
                return {
                    ...state,
                    objectList: update(state.objectList, 
                        { $merge: [updateObjectDamage] }
                    ),
                }
            }
            // return state;
        }

        // user actions
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