import { combineReducers } from 'redux';

import navigator from './navigator';
import alarms from './alarms';
import notificationSettings from './notificationSettings';
import infoCards from './infoCards';
import accessibility from './accessibility';

const rootReducer = combineReducers({
  navigator,
  alarms,
  notificationSettings,
  infoCards,
  accessibility,
});

export default rootReducer;
