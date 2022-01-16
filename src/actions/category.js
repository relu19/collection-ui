import Actions from "./api";

export const addNewCategory = async (category) => {
    const data = {
        name: category.name,
        order: parseInt(category.order)
    }
    return Actions.post(data, `categories`)
};

export const removeCategory = async (category) => {
    const data = {
        id: parseInt(category.id),
        name: category.name,
        order: parseInt(category.order) || 1
    }
    return Actions.post(data, `remove-category`)
};

export const updateCategory = async (category) => {
    const data = {
        name: category.name,
        order: parseInt(category.order)
    }
    return Actions.patch(data, `categories/${category.id}`)
};

