import { combineReducers } from 'redux';
import authReducer from './authReducer';
import calendarReducer from './communityReducer';
import communityReducer from './communityReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  community: communityReducer,
  //ostali reduceri
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
