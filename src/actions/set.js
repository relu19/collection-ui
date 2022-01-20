import Actions from "./api";
import {ACTIONS} from "../config";
import {createNumbersArray} from "../utils/createNumbersArray";


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
    // get existing numbers and replace therm in 'missing' array
    const numbers = await getNumbersForSet(set.id, userId) || []
    return {
        ...set,
        numbers: createNumbersArray(set, numbers, userId)
    };
}

export const _getSetsInCollection = async (set) => {
    const filter = {
        where: {
            categoryId: parseInt(set.categoryId),
            setTypeId: parseInt(set.setTypeId),
            usersId: parseInt(set.userId)
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


export const changeNumberStatus = async (dispatch, nr, set) => {
    const newType = nr.type > 2 ? 0 : nr.type + 1;
    if (newType === 1 && !nr.id) {
        const newNumber = {number: nr.number, setId: nr.setId, userId: nr.userId, type: newType}

        // add numbers to user collection
        return Actions.post(newNumber, `number`).then((res) => {
            if (res && !res.error) {
                dispatch({type: ACTIONS.UPDATE_SET_NUMBERS, numberList: res, set: set, userId: nr.userId});
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    if (newType === 0 && nr.id) {
        // remove number from user collection
        const removeNumber = {id: nr.id, number: nr.number, setId: nr.setId, userId: nr.userId, type: newType}
        return Actions.post(removeNumber, `remove-number`).then((res) => {
            if (res && !res.error) {
                dispatch({type: ACTIONS.UPDATE_SET_NUMBERS, numberList: res, set: set, userId: nr.userId});
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    const updateNumber = {id: nr.id, number: nr.number, setId: nr.setId, userId: nr.userId, type: newType}
    // update number status
    return Actions.patch(updateNumber, `number/${nr.id}`).then((res) => {
        if (res && !res.error) {
            dispatch({type: ACTIONS.UPDATE_SET_NUMBERS, numberList: res, set: set, userId: nr.userId});
        }
    }).catch((err) => {
            console.log(err)
        })
}

export const markAllAtOnce = async (dispatch, set, type, userId) => {
    const numbersData = {
        number: 0,
        type: type,
        setId: set.id,
        userId: userId
    };
    if (type === 0) {
        return Actions.post(numbersData, `remove-all-numbers`).then((res) => {
            if (res && !res.error) {
                dispatch({type: ACTIONS.UPDATE_SET_NUMBERS, numberList: res, set: set, userId: userId});
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    numbersData.minNr = set.minNr;
    numbersData.maxNr = set.maxNr;
    return Actions.post(numbersData, `add-all-numbers`).then((res) => {
        if (res && !res.error) {
            dispatch({type: ACTIONS.UPDATE_SET_NUMBERS, numberList: res, set: set, userId: userId});
        }
    }).catch((err) => {
        console.log(err)
    })
}


export const addSetToCollection = async (dispatch,  elem) => {
    return Actions.post(elem, 'set-users').then((res) => {
        if (res && !res.error) {
            dispatch({type: ACTIONS.ADD_TO_COLLECTION, res});
        }
    }).catch((err) => {
        console.log(err)
    })
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

export const removeFromCollection = async (dispatch, set, userId) => {
    return Actions.post({
        'setId': set.id,
        'userId': userId,
    }, 'remove-set-from-collection').then((res) => {
        if (res && !res.error) {
            dispatch({type: ACTIONS.REMOVE_FROM_COLLECTION, set});
        }
    }).catch((err) => {
        console.log(err)
    })
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
