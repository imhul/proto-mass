import { types } from './types';

export const addAcademy = (w, h) => ({
    type: types.RESIZE,
    payload: { w, h }
});
