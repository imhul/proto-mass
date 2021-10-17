import { createSelector } from 'reselect';

export const tasksSelector = createSelector(
    state => state.task,
    items => items.taskList
);

export const pendingsSelector = createSelector(
    state => state.task,
    items => items.pendingList
);
