import { combineReducers } from 'redux';
import filterReducer from './filter-reducer';
import setsReducer from './sets-reducer';
import categoryReducer from './category-reducer';
import typeReducer from "./type-reducer";

export default combineReducers({
    filterReducer,
    setsReducer,
    categoryReducer,
    typeReducer
});
