import { types } from './types';
import { initState } from './initState';

export default function timeReducer(state = initState, action) {
    switch (action.type) {
        case types.TIME_MACHINE_INIT:
            return {
                ...state,
                isTimeMachineInit: true
            };

        case types.SET_HOURS: {
            const day = Math.floor(state.gameHours / 24);
            const days = day === 0 ? 1 : day + 1;
            const year = Math.floor(state.gameDays / 365);
            const years = year === 0 ? 1 : year + 1;

            return {
                ...state,
                gameHours: state.gameHours + 1,
                gameDays: days,
                gameYears: years
            };
        }

        default:
            return state;
    }
}
