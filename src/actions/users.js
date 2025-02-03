import Actions from "./api";
import { v4 as uuidv4 } from 'uuid';
import {ACTIONS} from "../config";

export const createNewUser = async (user) => {
    return Actions.post({
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'logo': user.logo,
        'type': 1,
        'fbId': user.id,
        'publicId': uuidv4(),
    }, 'users')
};

export const getUsers = async () => {
    return Actions.get(
        `/users?filter=${JSON.stringify({
            fields: { id: true, fbId: true, name: true, logo: true, email: true },
        })}`,
    );
};

export const getUser = (user) => {
    return Actions.get(
        `users?filter=${JSON.stringify({
            where: {
                email: user?.email,
            },
        })}`,
    );
};


export const deleteUserAndNumbers = async (user, userDetails) => {
    if (userDetails.type !== parseInt(process.env.REACT_APP_FACEBOOK_ADMIN_TYPE)) {
        return false
    }
    return Actions.post({
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'type': 1,
        'fbId': user.fbId,
    }, 'remove-users')
};

export const getUserById = (user) => {
    return Actions.get(
        `users?filter=${JSON.stringify({
            where: {
                id: user.userId,
            },
        })}`,
    );
};

export const changeCategory = (dispatch, categoryId, setTypeId) => {
    dispatch({ type: ACTIONS.CHANGE_CATEGORY, categoryId, setTypeId });
};

export const changeFilters = (dispatch, filters) => {
    dispatch({ type: ACTIONS.CHANGE_FILTERS, filters });
};
