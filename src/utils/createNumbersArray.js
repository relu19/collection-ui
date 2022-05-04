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


const turbo121 = [{"number":"124","desc":"BMW 318"},{"number": "131", "desc": "pEntera"}, {"number": "144", "desc": "Motor: 1500cc"}, {"number": "149", "desc": "Diablo"}, {"number": "159", "desc": "SL 300"}, {"number": "188", "desc": "Voltswagen"}]
const sindy = [{"number":"1","desc":"3rd Number"}, {"number": "2", "desc": "3rd Number"}, {"number": "6", "desc": "3rd Number"}, {"number": "7", "desc": "3rd Number"}]
const sindy2 = [{"number": "1", "desc": "4th Number"}]
const flinstones = [{"number": "36", "desc": "Mirrored Bottom Text"}]
const cincin = [{"number": "7", "desc": "UK Flag" }, { "number": "9", "desc": "Syria Flag" }, { "number": "17", "desc": "UK Flag" }, { "number": "27", "desc": "UK Flag" }, { "number": "39", "desc": "UK Flag" }, { "number": "50", "desc": "UK Flag" }, { "number": "59", "desc": "UK Flag" }, { "number": "64", "desc": "Syria Flag" }, { "number": "67", "desc": "UK Flag" }]
