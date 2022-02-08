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
            const setNumbers = createNumbersArray(action.data, action.numberList, action.userId)
            const setFound = state.list.findIndex(item => item.id === action.data.id)
            state.list[setFound].numbers = setNumbers
            return objectAssign({}, state);
        case ACTIONS.UPDATE_SET_INFO:
            const getSetIndex = state.list.findIndex(item => item.id === action.data.id)
            const numbers = state.list[getSetIndex].numbers;
            state.list[getSetIndex] = action.data
            state.list[getSetIndex].numbers = numbers
            state.list[getSetIndex].inCollection = true
            return objectAssign({}, state);
        case ACTIONS.ADD_SET_TO_LIST:
            const newSet = action?.data?.setData;
            newSet.numbers = createNumbersArray(newSet, [], action.userId)
            state.list.push(action?.data?.setData)
            return objectAssign({}, state);
        case ACTIONS.DELETE_SET_AND_NUMBERS:
            const setToDelete = state.list.findIndex(item => item.id === action.data.id)
            state.list.splice(setToDelete, 1)
            return objectAssign({}, state);
        case ACTIONS.ADD_TO_COLLECTION:
            const setToAdd = state.list.findIndex(item => item.id === action.data.setId)
            state.list[setToAdd].inCollection = true
            return objectAssign({}, state);
        case ACTIONS.REMOVE_FROM_COLLECTION:
            const setToRemove = state.list.findIndex(item => item.id === action.data.id)
            state.list[setToRemove].inCollection = false
            state.list[setToRemove].numbers.map(item => item.type = 0)
            return objectAssign({}, state);
        case ACTIONS.GET_SETS:
            return objectAssign({}, state, { list: action.data });
        default:
            return state;
    }
}