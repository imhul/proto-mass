import { createSelector } from 'reselect';

const appSelector = state => state.app;
const authSelector = state => state.auth;
const gameSelector = state => state.game;
const mapSelector = state => state.map;
const stageSelector = state => state.stage;
const taskSelector = state => state.task;
const timeSelector = state => state.time;
const unitsSelector = state => state.unit;
