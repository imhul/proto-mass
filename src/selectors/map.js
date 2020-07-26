import { createSelector } from 'reselect';

export const mapSelector = createSelector(
    state => state.map,
    items => items
);

export const isObjectsCreatedSelector = createSelector(
    mapSelector,
    items => items.isObjectsCreated
);
