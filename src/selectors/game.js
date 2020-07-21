import { createSelector } from 'reselect';

export const gameSelector = createSelector(
    state => state.game,
    items => items
);

export const isGameStartedSelector = createSelector(
    gameSelector,
    items => items.isGameStarted
);

export const isGamePausedSelector = createSelector(
    gameSelector,
    items => items.isGamePaused
);

export const isGameInitSelector = createSelector(
    gameSelector,
    items => items.isGameInit
);

export const isMapLoadedSelector = createSelector(
    gameSelector,
    items => items.isMapLoaded
);

export const isMapVisibleSelector = createSelector(
    gameSelector,
    items => items.isMapVisible
);

export const getLoadingPercentSelector = createSelector(
    gameSelector,
    items => items.loadingPercent
);
