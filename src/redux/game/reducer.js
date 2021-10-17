import { types } from './types';
import { initState } from './initState';
import update from 'immutability-helper';

export default function gameReducer(state = initState, action) {
    switch (action.type) {
        case types.SINTHESIZE_NEW_GAME:
            return {
                ...state,
                preloaderTitle: 'start synthesizing a new game',
                isLoadSavedGame: false,
                loadingPercent: 1
            };

        case types.MAP_LOADED:
            return {
                ...state,
                isMapLoaded: true,
                isMapVisible: true,
                loadingPercent: action.payload,
                preloaderTitle: 'map is loaded'
            };

        case types.MAP_LOADING:
            return {
                ...state,
                isMapVisible: false,
                loadingPercent: action.payload,
                preloaderTitle: 'start loading map',
                isMapLoadingStarted: true
            };

        case types.START_OR_LOAD_MODAL_CLOSE:
            return {
                ...state,
                isStartOrLoadModalOpen: false
            };

        case types.LOAD_GAME_SAVE:
            return {
                ...state,
                save: action.payload,
                isLoadSavedGame: true
            };

        case types.LOADING_GAME_UPDATE:
            return {
                ...state,
                loadingPercent: action.payload,
                isGameLoaded: action.payload > 98 ? true : false,
                preloaderTitle: action.meta ? action.meta : '...'
            };

        case types.INIT_GAME:
            return {
                ...state,
                isGameInit: true,
                isMapVisible: true,
                isGameLoaded: true,
                preloaderTitle: 'Complete!',
                loadingPercent: 100
            };

        case types.START_GAME:
            return {
                ...state,
                isGameStarted: true
            };

        case types.STOP_GAME:
            return {
                ...state,
                isGameStarted: false
            };

        case types.TOGGLE_PAUSE_GAME:
            return {
                ...state,
                isGamePaused: !state.isGamePaused
            };

        case types.GAMEOVER:
            return {
                ...state,
                isGameover: true,
                isWin: false
            };

        case types.WIN_GAME:
            return {
                ...state,
                isGameover: false,
                isWin: true
            };

        case types.EXIT_GAME:
            return initState;

        case types.ERROR_GAME:
            return {
                ...state,
                error: {
                    title: action.payload.error.code,
                    desc: action.payload.error.message
                }
            };

        case types.SAVE_GAME:
            return {
                ...state,
                save: action.payload
            };

        case types.SET_VOLUME:
            return {
                ...state,
                settings: {
                    volume: action.payload
                }
            };

        case types.TOGGLE_GAME_MENU_ESC:
            return {
                ...state,
                isGameMenuOpen: !state.isGameMenuOpen
            };

        case types.START_GAME_FORM_UPDATE:
            return {
                ...state,
                save: update(state.save, {
                    colony: {
                        $set: action.payload.colony
                    }
                }),
                startGameForm: update(state.startGameForm, { $set: action.payload.colony.name })
            };

        default:
            return state;
    }
}
