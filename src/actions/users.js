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


export const getUser = async (user) => {
    return Actions.get(
        `/users?filter=${JSON.stringify({
            where: {
                fbId: user?.userId,
            },
        })}`,
    );
};
