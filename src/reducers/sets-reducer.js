import {  ACTIONS } from '../config';
import {createNumbersArray} from "../utils/createNumbersArray";
import objectAssign from "object-assign";

const defaultState = {
    list :[],
};

/**
 *
 * @param {object} state state object
 * @param {object} action response action
 */
export default function setsReducer(state = defaultState, action) {
    switch (action.type) {
        case ACTIONS.UPDATE_SET_NUMBERS:
            const setNumbers = createNumbersArray(action.set, action.numberList, action.userId)
            const setFound = state.list.findIndex(item => item.id === action.set.id)
            state.list[setFound].numbers = setNumbers
            return objectAssign({}, state);
        case ACTIONS.ADD_TO_COLLECTION:
            const setToAdd = state.list.findIndex(item => item.id === action.res.setId)
            state.list[setToAdd].inCollection = true
            return objectAssign({}, state);
        case ACTIONS.REMOVE_FROM_COLLECTION:
            const setToRemove = state.list.findIndex(item => item.id === action.set.id)
            state.list[setToRemove].inCollection = false
            return objectAssign({}, state);
        case ACTIONS.GET_SETS:
            return objectAssign({}, state, { list: action.data });
        default:
            return state;
    }
}