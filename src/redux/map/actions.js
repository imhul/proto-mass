import { types } from './types';

export const mapClick = position => ({
    type: types.MAP_CLICK,
    payload: position,
});

export const dragMapStart = position => ({
    type: types.MAP_DRAG_START,
    payload: position,
});

export const dragMapMove = position => ({
    type: types.MAP_DRAG_MOVE,
    payload: position,
});

export const dragMapStop = position => ({
    type: types.MAP_DRAG_STOP,
    payload: position,
});
