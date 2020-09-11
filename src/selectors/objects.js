import { createSelector } from 'reselect';

// utils
import memoize from "lodash.memoize";

export const objectsSelector = createSelector(
    state => state.map,
    items => items.objectList
);

export const getObjectByPositionSelector = createSelector(
    objectsSelector,
    objects => memoize(position => 
        objects.find(object => 
            object.position.x === position.x && 
            object.position.y === position.y)
    )
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
        }
    })
);
