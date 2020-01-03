import { types } from './types';

export const resize = (w, h) => ({
    type: types.RESIZE,
    payload: { w, h }
});

export const fullscreen = isFull => ({
    type: types.FULLSCREEN,
    payload: isFull
});
