import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import authReducer from './auth/reducer';
import appReducer from './app/reducer';
import gameReducer from './game/reducer';
import stageReducer from './stage/reducer';
import mapReducer from './map/reducer';
import unitReducer from './unit/reducer';


export default history => combineReducers({
  router: connectRouter(history),
  auth: authReducer,
  app: appReducer,
  game: gameReducer,
  stage: stageReducer,
  map: mapReducer,
  unit: unitReducer,
});

  