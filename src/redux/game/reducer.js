import { types } from './types';
import { initState } from './initState';

export default function gameReducer(state = initState, action) {
    switch (action.type) {

        case types.START_LOADING_GAME:
            return {
                ...state,
                isLoad: true,
            }

        case types.LOADING_GAME_COMPLETE:
            return {
                ...state,
                isLoad: false,
            }

        case types.INIT_GAME:
            return {
                ...state,
                isInit: true,
            }

        case types.START_GAME:
            return {
                ...state,
                isStarted: true,
            }

        case types.STOP_GAME:
            return {
                ...state,
                isStarted: false,
            }

        case types.TOGGLE_PAUSE_GAME:
            return {
                ...state,
                isPaused: !state.isPaused,
            }

        case types.GAMEOVER:
            return {
                ...state,
                isGameover: true,
                isWin: false,
            }

        case types.WIN_GAME:
            return {
                ...state,
                isGameover: false,
                isWin: true,
            }

        case types.EXIT_GAME:
            return {
                ...state,
                isStarted: false,
                isInit: false,
            }

        case types.ERROR_GAME:
            return {
                ...state,
                error: {
                    title: action.payload.error.code,
                    desc: action.payload.error.message,
                },
            }

        case types.SAVE_GAME:
            return {
                ...state,
                save: action.payload,
            }

        default:
            return state
    }
};