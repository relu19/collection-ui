import Actions from "./api";

export const createNewUser = async (user) => {
    return Actions.post({
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'type': 1,
        'fbId': user.userId,
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
