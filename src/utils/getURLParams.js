export const getURLParams = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userPublicId = urlParams.get('id')
    const userId = userPublicId && userPublicId.split('-')
    return queryString && {
        category: urlParams.get('cat'),
        type: urlParams.get('type'),
        userId: userId[0],
        userPublicId: userPublicId
    }
}