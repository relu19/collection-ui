import {  ACTIONS } from '../config';

const defaultState = [];

/**
 *
 * @param {object} state state object
 * @param {object} action response action
 */
export default function typeReducer(state = defaultState, action) {
    switch (action.type) {
        case ACTIONS.GET_TYPES:
            return action.data;
        default:
            return state;
    }
}
