import Actions from "./api";
import {ACTIONS} from "../config";


export const getAllSetsWithNumbers = async (dispatch, params) => {
    // get all sets is from user collection
    const allSetsInCollection = await _getSetsInCollection(params);
    // get all sets
    const allSets = await _getAllSetsInCategory(params, allSetsInCollection);
    // for each set create an array with all numbers from minNr to MaxNr
    return _createSetNumbersArray(allSets, params.userId).then((res) => {
        if (res && !res.error) {
            dispatch({type: ACTIONS.GET_SETS, data: res});
        }
    })
        .catch((err) => {
            console.log(err)
        })
};

export const _getAllSetsInCategory = async (params, allSetsInCollection) => {
    const filter = {
        where: {
            setTypeId: parseInt(params.setTypeId),
            categoryId: parseInt(params.categoryId),
        }
    }

    const collectionSetIs = []
    allSetsInCollection.length && allSetsInCollection.map(c => collectionSetIs.push(c.setId))
    const allSets = await Actions.get(`sets?filter=${JSON.stringify(filter)}`)
        .then((res) => {
            return res;
        }).catch((err) => {
            console.log(err);
        });

    // add 'inCollection' true if set it's in user collection'
    const sortedSets = []
    allSets.map(st => sortedSets.push({...st, inCollection: collectionSetIs.indexOf(st.id) > -1}))
    return sortedSets
};

const _createSetNumbersArray = async (sets, userId) => {
    const promiseArray = [];
    sets && sets.length && sets.forEach((set) => {
        promiseArray.push(_addNumbersToSet(set, userId));
    });
    return await Promise.all(promiseArray);
};


const _addNumbersToSet = async (set, userId) => {
    // create all numbers as 'missing'
    const numbersArray = []
    for (let i = set.minNr; i <= set.maxNr; i++) {
        numbersArray.push({
            number: i,
            setId: set.id,
            userId: parseInt(userId),
            type: 0,
        })
    }
    // get existing numbers and replace therm in 'missing' array
    const numbers = await getNumbersForSet(set.id, userId) || []
    const mergedNumbers = _mergeArrays(numbersArray, numbers, "number")
    return {
        ...set,
        numbers: mergedNumbers.sort((a, b) => a.number - b.number)
    };
}

export const _getSetsInCollection = async (set) => {
    const filter = {
        where: {
            categoryId: parseInt(set.categoryId),
            setTypeId: parseInt(set.setTypeId),
            userId: parseInt(set.userId)
        },
        fields: {setId: true}
    }
    return Actions.get(`set-users?filter=${JSON.stringify(filter)}`)
        .then((res) => {
            return res;
        }).catch((err) => {
            console.log(err);
        });
};

const _mergeArrays = (a, b, p) => {
    return a.filter(aa => !b.find(bb => aa[p] === bb[p])).concat(b);
}

const getNumbersForSet = async (setId, userId) => {
    return Actions.get(
        `numbers?filter=${JSON.stringify({
            where: {
                setId: setId,
                userId: userId,
            },
        })}`,
    );
};


export const getSetsFotThisType = async (typeId) => {
    const filter = {
        where: {
            setTypeId: parseInt(typeId),
        }
    }
    return Actions.get(`sets?filter=${JSON.stringify(filter)}`)
};


export const changeNumberStatus = async (nr) => {
    const newType = nr.type > 2 ? 0 : nr.type + 1;
    if (newType === 1 && !nr.id) {
        const newNumber = {number: nr.number, setId: nr.setId, userId: nr.userId, type: newType}
        // add numbers to user collection
        return Actions.post(newNumber, `number`);
    }
    if (newType === 0 && nr.id) {
        // remove number from user collection
        const removeNumber = {id: nr.id, number: nr.number, setId: nr.setId, userId: nr.userId, type: newType}
        return Actions.post(removeNumber, `remove-number`);
    }
    // update number status
    return Actions.patch({type: newType}, `number/${nr.id}`);
}

export const markAllAtOnce = async (set, type, userId) => {
    const numbersData = {
        number: 0,
        type: type,
        setId: set.id,
        userId: userId
    };
    if (type === 0) {
        return Actions.post(numbersData, `remove-all-numbers`);
    }
    numbersData.minNr = set.minNr;
    numbersData.maxNr = set.maxNr;
    return Actions.post(numbersData, `add-all-numbers`);
}


export const addSetToCollection = async (elem) => {
    return Actions.post(elem, 'set-users')
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
    }, 'remove-numbers-from-collection')
}

export const deleteSetAndNumbers = async (set) => {
    return Actions.post({
        'id': set.id,
        'name': set.name,
        'minNr': set.minNr,
        'maxNr': set.maxNr,
        'setTypeId': set.type,
        'categoryId': set.category,
    }, 'delete-set')
}
