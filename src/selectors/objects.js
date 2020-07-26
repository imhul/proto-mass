import { createSelector } from 'reselect';

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
    trees => {
        const treesPositions = trees.map(tree => {
            return {
                x: tree.position.x,
                y: tree.position.y,
            }
        });
        return treesPositions
    }
);
