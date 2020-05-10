import { types } from './types';

export const initApp = () => ({
    type: types.APP_INIT,
});

export const startLoadApp = () => ({
    type: types.START_LOADING_APP,
});

export const loadApp = percent => ({
    type: types.LOADING_APP,
    payload: percent,
});

export const endLoadApp = () => ({
    type: types.LOADING_APP_COMPLETE,
});

export const getNotify = options => ({
    type: types.SHOW_MESSAGE,
    payload: options,
});
  
export const setArchiveMessage = options => ({
    type: types.ARCHIVE_MESSAGE,
    payload: options,
});