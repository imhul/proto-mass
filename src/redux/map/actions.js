import { types } from './types';

export const mapClick = position => ({
    type: types.USER_ACTION,
    payload: position,
});

export const mapIncrease = () => ({
    type: types.MAP_INCREASE
});

export const mapDecrease = () => ({
    type: types.MAP_DECREASE
});

export const dragMapMove = position => ({
    type: types.MAP_DRAG_MOVE,
    payload: position,
});

export const dragMapStop = position => ({
    type: types.MAP_DRAG_STOP,
    payload: position,
});
