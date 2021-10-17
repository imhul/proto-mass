import { createSelector } from 'reselect';

export const authSelector = createSelector(
    state => state.auth,
    items => items
);

export const isAuthenticatedSelector = createSelector(authSelector, items => items.isAuthenticated);

export const userSelector = createSelector(authSelector, items => items.user);
