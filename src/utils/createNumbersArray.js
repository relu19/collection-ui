export const createNumbersArray = (set, numbers, userId) => {

    // create all numbers as 'missing'
    const numbersArray = []
    for (let i = set.minNr; i <= set.maxNr; i++) {
        numbersArray.push({
            number: i,
            setId: set.id,
            userId: parseInt(userId),
            type: 0,
        })
    }

    const mergedNumbers = _mergeArrays(numbersArray, numbers, "number")
    return mergedNumbers.sort((a, b) => a.number - b.number)
}


const _mergeArrays = (a, b, p) => {
    return a.filter(aa => !b.find(bb => aa[p] === bb[p])).concat(b);
}