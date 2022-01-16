import objectAssign from 'object-assign';
import {  ACTIONS } from '../config';
import {getURLParams} from "../utils/getURLParams";

const defaultState = getURLParams();

/**
 *
 * @param {object} state state object
 * @param {object} action response action
 */
export default function filterReducer(state = defaultState, action) {
    switch (action.type) {
        case ACTIONS.CHANGE_FILTERS:
            return objectAssign({}, state, action.filters);
        case ACTIONS.CHANGE_USER:
            return objectAssign({}, state, { user: action });
        case ACTIONS.CHANGE_CATEGORY:
            return objectAssign({}, state, { categoryId: action.categoryId, setTypeId: action.setTypeId });
        default:
            return state;
    }
}
