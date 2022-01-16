import {  ACTIONS } from '../config';

const defaultState = [];

/**
 *
 * @param {object} state state object
 * @param {object} action response action
 */
export default function categoriesReducer(state = defaultState, action) {
    switch (action.type) {
        case ACTIONS.GET_CATEGORIES_WITH_TYPES:
            return action.data;
        default:
            return state;
    }
}
