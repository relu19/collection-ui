import Actions from "./api";
import {ACTIONS} from "../config";


export const addNewType = async (newType, id) => {
    const data = {
        name: newType.name,
        categoryId: id,
        icon: newType.icon
    }
    return Actions.post(data, 'set-types')
};


export const removeSetType = async (setType) => {
    const data = {
        id: parseInt(setType.id),
        name: setType.name,
        icon: setType.icon,
        order: parseInt(setType.order) || 1
    }

    return Actions.post(data, `remove-set-type`)
};

export const updateSetType = async (setType) => {
    const data = {
        name: setType.name,
        order: parseInt(setType.order),
        icon: setType.icon || ''
    }
    return Actions.patch(data, `set-types/${setType.id}`)
};

export const getCategoriesWithSetTypes = async (dispatch) => {
    const allCategories = await _getCategories();
    const sortedCategories = allCategories.sort((a, b) => a?.order - b?.order)
    return _getCategoryTypes(sortedCategories).then((res) => {
        if (res && !res.error) {
            dispatch({type: ACTIONS.GET_CATEGORIES_WITH_TYPES, data: res});
        }
    })
        .catch((err) => {
            console.log(err)
        })
};

const _getCategoryTypes = async (cat) => {
    const promiseArray = [];
    cat && cat.length && cat.forEach((set) => {
        promiseArray.push(_addNumbersToSet(set));
    });
    return await Promise.all(promiseArray);
};


const _addNumbersToSet = async (set) => {
    const numbers = await _getTypesForCategory(set.id)
    const sortedNumbers = numbers.sort((a, b) => a?.order - b?.order)
    return {
        ...set,
        categoryTypes: sortedNumbers,
    };
}

export const _getCategories = async () => {
    return Actions.get(`categories`)
};

export const _getTypesForCategory = async (setId) => {
    const filter = {
        where: {
            categoryId: setId
        },
    }
    return Actions.get(`set-types?filter=${JSON.stringify(filter)}`)
};