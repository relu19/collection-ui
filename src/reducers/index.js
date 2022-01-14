import { combineReducers } from 'redux';
import filterReducer from './filter-reducer';
import setsReducer from './sets-reducer';

export default combineReducers({
    filterReducer,
    setsReducer
});
