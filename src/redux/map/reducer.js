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

        default:
            return state
    }
};