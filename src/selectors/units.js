import { createSelector } from 'reselect';

// utils
import memoize from "lodash.memoize";

export const unitsSelector = createSelector(
    state => state.unit,
    items => items.unitList
);

export const currentUnitSelector = createSelector(
    state => state.unit,
    items => items.current
);

export const currentUnitPositionSelector = createSelector(
    currentUnitSelector,
    currentUnit => currentUnit.position
);

export const getUnitByIdSelector = createSelector(
        unitsSelector,
        units => memoize(unitId => units.filter(unit => unit.id === unitId)[0])
);
