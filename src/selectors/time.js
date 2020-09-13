import { createSelector } from 'reselect';

export const timeSelector = createSelector(
    state => state.time,
    items => items
);

export const isTimeMachineInitSelector = createSelector(
    timeSelector,
    items => items.isTimeMachineInit
);

export const gameHoursSelector = createSelector(
    timeSelector,
    items => items.gameHours
);

export const gameDaysSelector = createSelector(
    timeSelector,
    items => items.gameDays
);

export const gameYearsSelector = createSelector(
    timeSelector,
    items => items.gameYears
);
