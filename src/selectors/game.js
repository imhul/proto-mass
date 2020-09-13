import { createSelector } from 'reselect';

export const gameSelector = createSelector(
    state => state.game,
    items => items
);

export const gameSettingsSelector = createSelector(
    gameSelector,
    items => items.settings
);

export const isGameInitSelector = createSelector(
    gameSelector,
    items => items.isGameInit
);

export const isGameLoadedSelector = createSelector(
    gameSelector,
    items => items.isGameLoaded
);

export const isGameStartedSelector = createSelector(
    gameSelector,
    items => items.isGameStarted
);

export const isGamePausedSelector = createSelector(
    gameSelector,
    items => items.isGamePaused
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

export const isLoadSavedGameSelector = createSelector(
    gameSelector,
    items => items.isLoadSavedGame
);

export const preloaderTitleSelector = createSelector(
    gameSelector,
    items => items.preloaderTitle
);

export const isStartOrLoadModalOpenSelector = createSelector(
    gameSelector,
    items => items.isStartOrLoadModalOpen
);

export const isGameMenuOpenSelector = createSelector(
    gameSelector,
    items => items.isGameMenuOpen
);

export const startGameFormSelector = createSelector(
    gameSelector,
    items => items.startGameForm
);

export const isGameErrorSelector = createSelector(
    gameSelector,
    items => items.error
);
