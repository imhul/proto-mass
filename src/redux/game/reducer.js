import { types } from './types';
import { initState } from './initState';

export default function gameReducer(state = initState, action) {
    switch (action.type) {

        case types.MAP_LOADED: 
            return {
                ...state,
                isMapLoaded: true,
            }

        case types.LOADING_GAME: 
            return {
                ...state,
                loadingPercent: action.payload,
                isGameLoaded: action.payload > 60 ? true : false,
            }

        case types.INIT_GAME:
            return {
                ...state,
                isGameInit: true,
            }

        case types.START_GAME:
            return {
                ...state,
                isGameStarted: true,
            }

        case types.STOP_GAME:
            return {
                ...state,
                isGameStarted: false,
            }

        case types.TOGGLE_PAUSE_GAME:
            return {
                ...state,
                isGamePaused: !state.isGamePaused,
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
                isGameStarted: false,
                isGameInit: false,
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

        case types.SET_VOLUME:
            return {
                ...state,
                settings: {
                    volume: action.payload
                },
            }

        case types.TOGGLE_DRAWER:
            return {
                ...state,
                isGameMenuOpen: !state.isGameMenuOpen,
            }

        default:
            return state
    }
};