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

        default:
            return state
    }
};