import { createSelector } from 'reselect';

// Selectors
// import { currentUnitPositionSelector } from './units';

export const objectsSelector = createSelector(
    state => state.map,
    items => items.objectList
);

export const treesSelector = createSelector(
    objectsSelector,
    objects => objects.filter(item => item.type === "tree")
);

export const mineralsSelector = createSelector(
    objectsSelector,
    objects => objects.filter(item => item.type === "mineral")
);

export const fakePathSelector = createSelector(
    treesSelector,
    trees => trees.map(tree => {
        return {
            x: tree.position.x,
            y: tree.position.y,
            done: false,
        }
    }).filter((trees, index) => index < 10)
);
