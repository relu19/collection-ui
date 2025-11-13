import Actions from "./api";
import { v4 as uuidv4 } from 'uuid';
import {ACTIONS} from "../config";

/**
 * Authenticate user with Google token and get JWT
 * @param {string} googleToken Google ID token from Google login
 * @returns {Promise<{token: string, user: object}>}
 */
export const authenticateWithGoogle = async (googleToken) => {
    return Actions.post({
        'token': googleToken
    }, 'auth/google-login');
};

export const createNewUser = async (user) => {
    return Actions.post({
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'logo': user.logo,
        'type': 1,
        'username': user.id,
        'contactEmail': uuidv4(),
    }, 'users')
};

export const getUsers = async () => {
    return Actions.get(
        `/users?filter=${JSON.stringify({
            fields: { id: true, username: true, name: true, logo: true, email: true },
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
        'username': user.username,
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

export const updateProfile = async (userId, profileData) => {
    return Actions.patch(profileData, `users/${userId}`);
};
