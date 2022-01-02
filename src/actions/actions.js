import ApiActions from "./api";
import Actions from "./api";


export const getAllSetsWithNumbers = async () => {
    const allSets = await getSets();
    const setWithNumbers = await _getNumbersForSet(allSets);
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

const _getNumbersForSet = async (sets) => {
    const promiseArray = [];
    sets && sets.length && sets.forEach((set) => {
        promiseArray.push(_addNumbersToSet(set, set.id));
    });
    return await Promise.all(promiseArray);
};


const _addNumbersToSet = async (set, setId) => {
    const numbers = await getNumbersForSet(setId)
    return {
        ...set,
        numbers: numbers,
    };
}

const getNumbersForSet = async (setId) => {
    return await Actions.get(
        `/numbers?filter=${JSON.stringify({
            where: {
                setId: setId,
            },
        })}`,
    );
};

export const changeNumberStatus = async (nr) => {
    const newValue = nr.type > 2 ? 0 : nr.type + 1;
    console.log('nr', nr)
    return Actions.patch({ type: newValue }, `/numbers/${nr.id}`);
}

export const addSet = async (newSet) => {
    return Actions.post({
        'name': newSet.name,
        'minNr': newSet.min,
        'maxNr': newSet.max,
        'type': newSet.type,
        'image': newSet.type,
        'link': newSet.link
    }, 'sets')
};