import Actions from "./api";
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
        'username': '',
        'contactEmail': '',
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
    // Only admins (type 114) can delete users
    const ADMIN_TYPE = 114;
    const isAdmin = userDetails && userDetails.type === ADMIN_TYPE;
    
    if (!isAdmin) {
        throw new Error('Only administrators can delete users');
    }
    
    if (!user.email) {
        throw new Error('User email is required for deletion');
    }
    
    return Actions.post({
        'name': user.name || '',
        'email': user.email,
        'phone': user.phone || '',
        'type': user.type || 1,
        'username': user.username || '',
        'contactEmail': user.contactEmail || '',
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
