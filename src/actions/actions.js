import ApiActions from "./api";
import Actions from "./api";


export const getAllSetsWithNumbers = async (userId) => {
    const allSets = await getSets();
    const setWithNumbers = await _getNumbersForSet(allSets, userId);
    return setWithNumbers;
};


export const getSets = async () => {
    return ApiActions.get(`sets`)
        .then((res) => {
            return res;
        }).catch((err) => {
            console.log(err);
        });
};

const _getNumbersForSet = async (sets, userId) => {
    const promiseArray = [];
    sets && sets.length && sets.forEach((set) => {
        promiseArray.push(_addNumbersToSet(set, set.id, userId));
    });
    return await Promise.all(promiseArray);
};


const _addNumbersToSet = async (set, setId, userId) => {
    const numbers = await getNumbersForSet(setId, userId)
    return {
        ...set,
        numbers: numbers,
        type: numbers.length ? 'inCollection' : 'remaining'
    };
}

const getNumbersForSet = async (setId, userId) => {
    return Actions.get(
        `/numbers?filter=${JSON.stringify({
            where: {
                setId: setId,
                userId: userId,
            },
        })}`,
    );
};

export const changeNumberStatus = async (nr) => {
    const newValue = nr.type > 2 ? 0 : nr.type + 1;
    return Actions.patch({ type: newValue }, `/numbers/${nr.id}`);
}

export const addSetNumbers = async (newSet) => {
    return Actions.post(newSet, 'numbers')
};


export const addSet = async (newSet) => {
    return Actions.post({
        'name': newSet.name,
        'minNr': newSet.min,
        'maxNr': newSet.max,
        'type': newSet.type,
        'image': newSet.image,
        'link': newSet.link
    }, 'sets')
};

export const removeSetNumbers = async (set, userId) => {
    return Actions.post({
        'setId': set.id,
        'userId': userId,
    }, 'remove-numbers')
}


export const createNewUser = async (user) => {
    return Actions.post({
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'type': 1,
        'fbId': user.id,
    }, 'users')
};


export const getUser = async (user) => {
    return Actions.get(
        `/users?filter=${JSON.stringify({
            where: {
                fbId: user.id,
            },
        })}`,
    );
};
