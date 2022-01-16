import { combineReducers } from 'redux';
import filterReducer from './filter-reducer';
import setsReducer from './sets-reducer';
import categoriesReducer from "./categories-reducer";

export default combineReducers({
    filterReducer,
    setsReducer,
    categoriesReducer
});
