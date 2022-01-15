import {  ACTIONS } from '../config';

const defaultState = [];

/**
 *
 * @param {object} state state object
 * @param {object} action response action
 */
export default function setsReducer(state = defaultState, action) {
    switch (action.type) {
        case ACTIONS.GET_SETS:
            return action.data;
        default:
            return state;
    }
}
