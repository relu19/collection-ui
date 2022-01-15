import Actions from "./api";
import {ACTIONS} from "../config";


export const addNewType = async (name, categoryId) => {
    const data = {
        name: name,
        categoryId: categoryId
    }
    return Actions.post(data, 'set-types')
};

export const updateSetType = async (setType) => {
    const data = {
        name: setType.name,
        order: parseInt(setType.order),
        icon: setType.icon || ''
    }
    return Actions.patch(data, `set-types/${setType.id}`)
};

export const getSetTypes = async (dispatch, categoryId) => {
    const filter = {
        where: {
            categoryId: categoryId
        },
    }
    return Actions.get(`set-types?filter=${JSON.stringify(filter)}`).then((res) => {
        if (res && !res.error) {
            dispatch({type: ACTIONS.GET_TYPES, data: res});
        }
    })
        .catch((err) => {
            console.log(err)
        })
};

export const getCategoriesWithSetTypes = async () => {
    const filter = {
        fields: {
            id: true,
            name: true,
            icon: true,
            categoryId: true
        },
        include: [
            {
                relation: "category",
            },
        ]
    }
    return Actions.get(`set-types?filter=${JSON.stringify(filter)}`)
};