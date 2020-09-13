import { createSelector } from 'reselect';

export const firebaseSelector = createSelector(
    state => state.firebase,
    items => items
);

export const authFirebaseSelector = createSelector(
    firebaseSelector,
    items => items.auth
);

export const profileFirebaseSelector = createSelector(
    firebaseSelector,
    items => items.profile
);
