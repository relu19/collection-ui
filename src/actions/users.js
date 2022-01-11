import Actions from "./api";
import { v4 as uuidv4 } from 'uuid';

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
                fbId: user?.userId,
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