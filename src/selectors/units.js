import { createSelector } from 'reselect';

// utils
import memoize from "lodash.memoize";

export const unitSelector = createSelector(
    state => state.unit,
    items => items
);

export const unitsSelector = createSelector(
    state => state.unit,
    items => items.unitList
);

export const unitsLimitSelector = createSelector(
    unitSelector,
    items => items.unitsLimit
);

export const selectedUnitSelector = createSelector(
    unitsSelector,
    units => units.find(unit => unit.isSelected)
);

// selected by id
export const getUnitByIdSelector = createSelector(
    unitsSelector,
    units => memoize(unitId => units.find(unit => unit.id === unitId))
);

// export const getUnitStatsSelector = createSelector(
//     getUnitByIdSelector,
//     unit => unit.stats
// );

// export const gettUnitDamageSelector = createSelector(
//     getUnitStatsSelector,
//     stats => stats.damage
// );

// export const gettUnitHealthSelector = createSelector(
//     getUnitStatsSelector,
//     stats => stats.health
// );

// export const gettUnitHealthPointsSelector = createSelector(
//     getUnitStatsSelector,
//     stats => stats.healthPoints
// );
