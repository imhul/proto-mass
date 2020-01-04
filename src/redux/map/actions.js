import { types } from './types';

export const mapClick = position => ({
    type: types.MAP_CLICK,
    payload: position,
});
