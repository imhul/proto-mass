import { createSelector } from 'reselect';

export const mapSelector = createSelector(
    state => state.map,
    items => items
);

export const isObjectsCreatedSelector = createSelector(
    mapSelector,
    items => items.isObjectsCreated
);

export const isObjectsCreationSelector = createSelector(
    mapSelector,
    items => items.isObjectsCreation
);

export const objectListSelector = createSelector(
    mapSelector,
    items => items.objectList
);

export const mapArraySelector = createSelector(
    mapSelector,
    items => items.map
);

export const matrixSelector = createSelector(
    mapSelector,
    items => items.matrix
);

export const userActionSelector = createSelector(
    mapSelector,
    items => items.userAction
);

export const clickPositionSelector = createSelector(
    mapSelector,
    items => items.clickPosition
);
