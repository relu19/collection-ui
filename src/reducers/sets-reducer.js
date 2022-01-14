import objectAssign from 'object-assign';
import {  ACTIONS } from '../config';
import {getURLParams} from "../utils/getURLParams";

const defaultState = [];

/**
 *
 * @param {object} state state object
 * @param {object} action response action
 * @returns {{cities: null}|any}
 */
export default function setsReducer(state = defaultState, action) {
    switch (action.type) {
        case ACTIONS.GET_SETS:
            return action.data;
        default:
            return state;
    }
}
