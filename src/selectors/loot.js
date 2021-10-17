import { createSelector } from 'reselect';

import { mapSelector } from './map';

export const lootSelector = createSelector(mapSelector, items => items.lootList);
