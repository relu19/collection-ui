import Actions from "./api";
import { v4 as uuidv4 } from 'uuid';
import {ACTIONS} from "../config";

export const createNewUser = async (user) => {
    return Actions.post({
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'type': 1,
        'fbId': user.id,
        'publicId': uuidv4(),
    }, 'users')
};

export const getUsers = async () => {
    return Actions.get(
        `users`,
    );
};

export const getUser = (user) => {
    return Actions.get(
        `/users?filter=${JSON.stringify({
            where: {
                fbId: user?.id,
            },
        })}`,
    );
};

export const getUserById = (user) => {
    return Actions.get(
        `/users?filter=${JSON.stringify({
            where: {
                id: user.userId,
                publicId: user.userPublicId
            },
        })}`,
    );
};

export const getUserName = async (user) => {
    const userData = await Actions.get(
        `/users?filter=${JSON.stringify({
            where: {
                publicId: user?.userId,
            },
            fields: ['name']
        })}`,
    );
    return userData ? userData[0].name : {}
};

export const changeCategory = (dispatch, setType) => {
    dispatch({ type: ACTIONS.CHANGE_CATEGORY, setType });
};

export const changeFilters = (dispatch, filters) => {
    dispatch({ type: ACTIONS.CHANGE_FILTERS, filters });
};
