export const getURLParams = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userId = urlParams.get('id')
    return queryString && {
        categoryId: urlParams.get('cat'),
        setTypeId: urlParams.get('type'),
        userId: userId
    }
}