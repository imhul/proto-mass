import { types } from './types';

export const initApp = () => ({
    type: types.APP_INIT,
});

export const loadApp = () => ({
    type: types.START_LOADING_APP,
});

export const endLoadApp = () => ({
    type: types.LOADING_APP_COMPLETE,
});
  