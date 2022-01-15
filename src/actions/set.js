import Actions from "./api";
import {ACTIONS} from "../config";


export const getAllSetsWithNumbers = async (dispatch, params) => {
    const allSets = await getSets(params);
    return _getNumbersForSet(allSets, params.userId).then((res) => {
        if (res && !res.error) {
            dispatch({type: ACTIONS.GET_SETS, data: res});
        }
    })
        .catch((err) => {
            console.log(err)
        })
};


export const getSets = async (params) => {
    const filter = {
        where: {
            setTypeId: parseInt(params.type),
            categoryId: parseInt(params.category),
            userId: params.userId
        }
    }
    return Actions.get(`sets?filter=${JSON.stringify(filter)}`)
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
        inCollection: numbers.length > 0
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
    return Actions.patch({type: newValue}, `/numbers/${nr.id}`);
}

export const markAllAtOnce = async (set, type, userId) => {
    const numbersData = {
        number: 0,
        type: type,
        setId: set.id,
        userId: userId
    };
    return Actions.patch(numbersData, `numbers`);
}


export const addSetNumbers = async (newSet) => {
    const numbersData = {
        number: 0,
        type: 0,
        setId: newSet.setId,
        userId: newSet.userId
    };
    const minNr = newSet.minNr
    const maxNr = newSet.maxNr
    return Actions.post({numbersData, minNr, maxNr}, 'numbers')
};


export const addSet = async (newSet) => {
    delete newSet.id
    return Actions.post(newSet, 'sets')
};

export const editSet = async (setData) => {
    delete setData.minNr
    delete setData.maxNr
    return Actions.patch(setData, `sets/${setData.id}`)
};

export const removeSetNumbers = async (set, userId) => {
    return Actions.post({
        'setId': set.id,
        'userId': userId,
    }, 'remove-numbers')
}

export const deleteSetAndNumbers = async (set) => {
    return Actions.post({
        'id': set.id,
        'name': set.name,
        'minNr': set.minNr,
        'maxNr': set.maxNr,
        'setTypeId': set.type,
        'categoryId': set.category,
    }, 'remove-set')
}
