import Actions from "./api";
import {ACTIONS} from "../config";
import {createNumbersArray} from "../utils/createNumbersArray";

export const getSetWithNumbers = async (setId, userId) => {
    const filter = {
        where: {
            id: parseInt(setId),
        }
    }
    const setData = await Actions.get(`sets?filter=${JSON.stringify(filter)}`)
        .then((res) => {
            return res;
        }).catch((err) => {
            console.log(err);
        });
    return _createSetNumbersArray(setData, userId)
};


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
    allSetsInCollection && allSetsInCollection.length && allSetsInCollection.map(c => collectionSetIs.push(c.setId))
    const allSets = await Actions.get(`sets?filter=${JSON.stringify(filter)}`)
        .then((res) => {
            return res;
        }).catch((err) => {
            console.log(err);
        });

    // add 'inCollection' true if set it's in user collection'
    const sortedSets = []
    allSets.length && allSets.map(st => sortedSets.push({...st, inCollection: collectionSetIs.indexOf(st.id) > -1}))
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
    // Get current user ID
    const userDetails = JSON.parse(localStorage.getItem('collector-data'));
    const currentUserId = userDetails?.id;

    // Prevent editing if not the owner
    if (nr.userId && nr.userId !== currentUserId) {
        return;
    }
    const newType = nr.type > 2 ? 0 : nr.type + 1;
    // Determine if this is an extra number
    let isExtra = false;
    if (set.extraNumbers) {
        try {
            const extraArr = typeof set.extraNumbers === 'string' ? JSON.parse(set.extraNumbers) : set.extraNumbers;
            isExtra = extraArr.some(n => n.number.toString() === nr.number.toString());
        } catch (e) {}
    }
    if (newType === 1 && !nr.id) {
        const newNumber = {number: nr.number, setId: nr.setId, userId: nr.userId, type: newType, desc: nr.desc || '', extra: isExtra}

        // add numbers to user collection
        return Actions.post(newNumber, `number`).then((res) => {
            if (res && !res.error) {
                dispatch({type: ACTIONS.UPDATE_SET_NUMBERS, numberList: res, data: set, userId: nr.userId});
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    const updateNumber = {id: nr.id, number: nr.number, setId: nr.setId, userId: nr.userId, type: newType, desc: nr.desc || ''}
    // update number status
    return Actions.patch(updateNumber, `number/${nr.id}`).then((res) => {
        if (res && !res.error) {
            dispatch({type: ACTIONS.UPDATE_SET_NUMBERS, numberList: res, data: set, userId: nr.userId});
        }
    }).catch((err) => {
            console.log(err)
        })
}

export const markAllAtOnce = async (dispatch, set, type, userId) => {
    // 1. Remove all numbers for this set/user
    await Actions.post({
        number: "0",
        type: 0,
        setId: set.id,
        userId: userId
    }, `remove-all-numbers`);

    // 2. Prepare numbers to add: use set.numbers only
    let numbersArray = [];
    if (Array.isArray(set.numbers)) {
        numbersArray = set.numbers.map(nr => ({
            number: nr.number,
            extra: nr.extra || false,
            desc: nr.desc || ''
        }));
    } else {
        // Generate numbers from minNr to maxNr
        for (let i = set.minNr; i <= set.maxNr; i++) {
            numbersArray.push({ number: i, extra: false, desc: '' });
        }
        // Add extraNumbers if present
        if (set.extraNumbers) {
            let extraArr = [];
            try {
                extraArr = typeof set.extraNumbers === 'string' ? JSON.parse(set.extraNumbers) : set.extraNumbers;
            } catch (e) {}
            extraArr.forEach(nr => {
                numbersArray.push({ number: nr.number, extra: true, desc: nr.desc || '' });
            });
        }
    }

    // 3. Add all numbers again with the given type
    const numbersData = {
        numbers: numbersArray,
        type: type,
        setId: set.id,
        userId: userId
    };
    return Actions.post(numbersData, `add-all-numbers`).then((res) => {
        if (res && !res.error) {
            dispatch({type: ACTIONS.UPDATE_SET_NUMBERS, numberList: res, data: set, userId: userId});
        }
    }).catch((err) => {
        console.log(err)
    });
};



export const addSetToCollection = async (dispatch,  elem) => {
    return Actions.post(elem, 'set-users').then((res) => {
        if (res && !res.error) {
            dispatch({type: ACTIONS.ADD_TO_COLLECTION, data: res});
        }
    }).catch((err) => {
        console.log(err)
    })
};


export const addSet = async (dispatch, newSet, userId) => {
    delete newSet.id
    if (newSet.group && newSet.extraNumbers) {
        newSet.extraNumbers = JSON.stringify(JSON.parse(newSet.extraNumbers))
    }
    return Actions.post(newSet, 'sets').then((res) => {
        if (res && !res.error) {
            dispatch({type: ACTIONS.ADD_SET_TO_LIST, data: res, userId: userId});
        }
    }).catch((err) => {
        console.log(err)
    })
};

export const editSet = async (dispatch, setData, userId) => {
    // Prepare extraNumbers as array
    let extraNumbersArr = [];
    if (setData.extraNumbers) {
        extraNumbersArr = JSON.parse(setData.extraNumbers);
        setData.extraNumbers = JSON.stringify(extraNumbersArr);
    }

    // 1. Update the set itself
    const setRes = await Actions.patch(setData, `sets/${setData.id}`);

    if (setRes && !setRes.error) {
        // 2. Fetch current numbers for this set/user
        const currentNumbers = await Actions.get(
            `numbers?filter=${JSON.stringify({
                where: {
                    setId: setData.id,
                    userId: userId,
                },
            })}`
        );

        // 3. Handle main numbers (minNr to maxNr)
        const allNumbers = await Actions.get(
            `numbers?filter=${JSON.stringify({
                where: {
                    setId: setData.id,
                },
            })}`
        );
        const userIds = [...new Set((allNumbers || []).map(n => n.userId))];

        for (const uid of userIds) {
            const userNumbers = (allNumbers || []).filter(n => n.userId === uid);
            const currentMainNumbers = userNumbers.filter(n => !n.extra);
            const currentMainNumbersSet = new Set(currentMainNumbers.map(n => n.number.toString()));
            const newMainNumbers = [];
            for (let i = setData.minNr; i <= setData.maxNr; i++) {
                newMainNumbers.push(i.toString());
            }
            const newMainNumbersSet = new Set(newMainNumbers);

            // To add: in newMainNumbers but not in currentMainNumbers
            const mainToAdd = newMainNumbers.filter(n => !currentMainNumbersSet.has(n));
            // To remove: in currentMainNumbers but not in newMainNumbers
            const mainToRemove = currentMainNumbers.filter(n => !newMainNumbersSet.has(n.number.toString()));

            // Add new main numbers (bulk operation)
            if (mainToAdd.length > 0) {
                const numbersData = {
                    numbers: mainToAdd.map(num => ({
                        number: num,
                        extra: false,
                        desc: ''
                    })),
                    setId: setData.id,
                    userId: uid
                };
                await Actions.post(numbersData, 'add-numbers-preserve-status');
            }

            // Remove deleted main numbers (bulk operation)
            if (mainToRemove.length > 0) {
                const removeData = {
                    setId: setData.id,
                    userId: uid,
                    numbers: mainToRemove.map(num => ({
                        id: num.id,
                        number: num.number
                    }))
                };
                await Actions.post(removeData, 'remove-multiple-numbers');
            }
        }

        // 3. Parse new extraNumbers
        let newExtras = [];
        if (setData.extraNumbers) {
            newExtras = JSON.parse(setData.extraNumbers);
        }

        // 4. Find extras to add and remove
        const currentExtras = (currentNumbers || []).filter(n => n.extra);
        const currentExtraNumbers = currentExtras.map(n => n.number.toString());
        const newExtraNumbers = newExtras.map(n => n.number.toString());

        // To add: in newExtras but not in currentExtras
        const extrasToAdd = newExtras.filter(n => !currentExtraNumbers.includes(n.number.toString()));

        // 5. Add new extras for all users who have this set (bulk operation)
        for (const uid of userIds) {
            const numbersData = {
                numbers: extrasToAdd.map(num => ({
                    number: num.number,
                    extra: true,
                    desc: num.desc || ''
                })),
                setId: setData.id,
                userId: uid
            };
            await Actions.post(numbersData, 'add-numbers-preserve-status');
        }

        // 6. Remove deleted extras for all users who have this set (bulk operation)
        for (const uid of userIds) {
            // Find extras to remove for this user
            const userExtrasToRemove = (allNumbers || [])
                .filter(n => n.userId === uid && n.extra && !newExtraNumbers.includes(n.number.toString()));
            
            if (userExtrasToRemove.length > 0) {
                const removeData = {
                    setId: setData.id,
                    userId: uid,
                    numbers: userExtrasToRemove.map(num => ({
                        id: num.id,
                        number: num.number
                    }))
                };
                await Actions.post(removeData, 'remove-multiple-numbers');
            }
        }

        // 7. Optionally, dispatch an action to update state
        dispatch({type: ACTIONS.UPDATE_SET_INFO, data: setRes});
    }
    return setRes;
};

//
// export const editSet = async (dispatch, setData) => {
//     return Actions.patch(setData, `sets/${setData.id}`).then((res) => {
//         if (res && !res.error) {
//             dispatch({type: ACTIONS.UPDATE_SET_INFO, data: res});
//         }
//     }).catch((err) => {
//         console.log(err)
//     })
// };

export const removeFromCollection = async (dispatch, set, userId) => {
    return Actions.post({
        'setId': set.id,
        'userId': userId,
    }, 'remove-set-from-collection').then((res) => {
        if (res && !res.error) {
            dispatch({type: ACTIONS.REMOVE_FROM_COLLECTION, data: set});
        }
    }).catch((err) => {
        console.log(err)
    })
}

export const deleteSetAndNumbers = async (dispatch, set) => {
    return Actions.post({
        'id': set.id,
        'name': set.name,
        'minNr': set.minNr,
        'maxNr': set.maxNr,
        'setTypeId': set.type,
        'categoryId': set.category,
    }, 'remove-set').then((res) => {
        if (res && !res.error) {
            dispatch({type: ACTIONS.DELETE_SET_AND_NUMBERS, data: set});
        }
    }).catch((err) => {
        console.log(err)
    })
}

export const getUsersWithSetInCollection = async (setId, categoryId, setTypeId) => {
    const filter = {
        where: {
            setId: parseInt(setId),
            categoryId: parseInt(categoryId),
            setTypeId: parseInt(setTypeId),
        },
        fields: {usersId: true}
    }
    return Actions.get(`set-users?filter=${JSON.stringify(filter)}`)
        .then((res) => {
            return res;
        }).catch((err) => {
            console.log(err);
        });
};

export const getAllSets = async () => {
    return Actions.get('sets')
        .then((res) => {
            return res;
        }).catch((err) => {
            console.log(err);
        });
};

export const getGlobalExchanges = async (userId) => {
    return Actions.post({userId}, 'global-exchanges')
        .then((res) => {
            return res;
        }).catch((err) => {
            console.log(err);
            return { exchanges: [] };
        });
};

export const getSetExchanges = async (setId, userId) => {
    return Actions.post({setId, userId}, 'set-exchanges')
        .then((res) => {
            return res;
        }).catch((err) => {
            console.log(err);
            return { exchanges: [] };
        });
};
