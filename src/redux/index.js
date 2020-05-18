import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore'
import authReducer from './auth/reducer';
import appReducer from './app/reducer';
import gameReducer from './game/reducer';
import stageReducer from './stage/reducer';
import mapReducer from './map/reducer';
import unitReducer from './unit/reducer';
import taskReducer from './task/reducer';

export default history => combineReducers({
  router: connectRouter(history),
  auth: authReducer,
  app: appReducer,
  game: gameReducer,
  stage: stageReducer,
  map: mapReducer,
  unit: unitReducer,
  task: taskReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

  