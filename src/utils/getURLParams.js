export const getURLParams = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userPublicId = urlParams.get('id')
    const userId = userPublicId && userPublicId.split('-')
    return queryString && {
        category: urlParams.get('cat'),
        type: urlParams.get('type'),
        userId: userId && userId[0],
        userPublicId: userId && `${userId[1]}-${userId[2]}-${userId[3]}-${userId[4]}-${userId[5]}`
    }
}