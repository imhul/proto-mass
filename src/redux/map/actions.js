import { types } from './types';

export const errorGame = (position) => ({
    type: types.MAP_CLICK,
    payload: position,
});
