import { createSelector } from 'reselect';

const gameSelector = state => state.game;
const unitsSelector = state => state.unit;

const totalSelector = createSelector(
    gameSelector,
    unitsSelector,
  (game, units) => game //
)

