import { types } from './types';

export const initGame = () => ({
    type: types.INIT_GAME,
});

export const loadGame = () => ({
    type: types.START_LOADING_GAME,
});

export const endLoadGame = () => ({
    type: types.LOADING_GAME_COMPLETE,
});

export const startGame = () => ({
    type: types.START_GAME,
});

export const stopGame = () => ({
    type: types.STOP_GAME,
});

export const pauseGame = () => ({
    type: types.TOGGLE_PAUSE_GAME,
});

export const gameover = () => ({
    type: types.GAMEOVER,
});

export const winGame = () => ({
    type: types.WIN_GAME,
});

export const saveGame = (save) => ({
    type: types.SAVE_GAME,
    payload: save,
});

export const exitGame = () => ({
    type: types.EXIT_GAME,
});

export const errorGame = (error) => ({
    type: types.ERROR_GAME,
    payload: error,
});

export const setVolume = (volume) => ({
    type: types.SET_VOLUME,
    payload: volume,
});

export const setVolume = () => ({
    type: types.TOGGLE_GAME_MENU_ESC,
    payload: volume,
});
