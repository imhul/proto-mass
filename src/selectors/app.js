import { createSelector } from 'reselect';

export const appSelector = createSelector(
    state => state.auth,
    items => items
);

export const isAppInitSelector = createSelector(
    appSelector,
    items => items.isAppInit
);

