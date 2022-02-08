export const createNumbersArray = (set, numbers, userId) => {

    // create all numbers as 'missing'
    const numbersArray = []
    if (set.minNr !== set.maxNr) {
        for (let i = set.minNr; i <= set.maxNr; i++) {
            numbersArray.push({
                number: i,
                setId: set.id,
                userId: parseInt(userId),
                type: 0
            })
        }
    } else {
        const setNumbers = JSON.parse(set.extraNumbers);
        setNumbers.forEach(nr => {
            numbersArray.push({
                number: parseInt(nr.number),
                setId: set.id,
                userId: parseInt(userId),
                type: 0,
                desc: nr.desc
            })
        })
    }

    const mergedNumbers = _mergeArrays(numbersArray, numbers, "number")
    return mergedNumbers.sort((a, b) => a.number - b.number)
}


const _mergeArrays = (a, b, p) => {
    return a.filter(aa => !b.find(bb => aa[p] === bb[p])).concat(b);
}


const example = [{"number":"124","desc":"BMW 318"},{"number": "131", "desc": "pEntera"}, {"number": "144", "desc": "Motor: 1500cc"}, {"number": "149", "desc": "Diablo"}, {"number": "159", "desc": "SL 300"}, {"number": "188", "desc": "Voltswagen"}]
