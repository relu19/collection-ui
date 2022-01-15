import Actions from "./api";
import {ACTIONS} from "../config";


export const addNewCategory = async (category) => {
    const data = {
        name: category.name,
        order: parseInt(category.order)
    }
    return Actions.post(data, `categories`)
};

export const updateCategory = async (category) => {
    const data = {
        name: category.name,
        order: parseInt(category.order)
    }
    return Actions.patch(data, `categories/${category.id}`)
};

export const getCategories = async (dispatch) => {
    return Actions.get(`categories`).then((res) => {
        if (res && !res.error) {
            dispatch({type: ACTIONS.GET_CATEGORIES, data: res});
        }
    })
        .catch((err) => {
            console.log(err)
        })
};
