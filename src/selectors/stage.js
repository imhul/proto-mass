import { createSelector } from 'reselect';

export const stageSelector = createSelector(
    state => state.stage,
    items => items
);

export const isFirstResizeSelector = createSelector(stageSelector, items => items.isFirstResize);

export const isFullscreenSelector = createSelector(stageSelector, items => items.isFullscreen);
