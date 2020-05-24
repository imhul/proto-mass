import { types } from './types';
import { initState } from './initState';

export default function timeReducer(state = initState, action) {
    switch (action.type) {

        case types.TIME_MACHINE_INIT:
            return {
                ...state,
                isTimeMachineInit: true,
            }


        case types.SET_MINUTES: {
            return {
                ...state,
                gameMinutes: action.payload,
            }
        }

        case types.SET_HOURS: {
            const days = Math.floor(state.gameHours / 24);
            return {
                ...state,
                gameHours: state.gameHours + 1,
                gameDays: days,
            }
        }

        case types.SET_DAYS: {
            return {
                ...state,
                
            }
        }

        case types.SET_YEARS: {
            return {
                ...state,
                gameYears: state.gameYears + 1,
            }
        }

        default:
            return state
    }
};