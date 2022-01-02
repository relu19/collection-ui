/**
 * @param {string} name localstorage variable
 * @param {string} value localstorage variable value
 */
export const setStorageItem = (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
}

/**
 * @param {string} name localstorage variable
 * @returns {string|undefined}
 */
export const getStorageItem = (name) => {
    try {
        return JSON.parse(localStorage.getItem(name));
    } catch (ignore) {
    }
}

/**
 * @param {string} name localstorage variable
 */
export const deleteStorageItem = (name) => {
    localStorage.removeItem(name);
}

