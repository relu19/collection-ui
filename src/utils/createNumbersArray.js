export const createNumbersArray = (set, numbers, userId) => {
    // create all numbers as 'missing'
    const numbersArray = [];

        for (let i = set.minNr; i <= set.maxNr; i++) {
            numbersArray.push({
                number: i.toString(),
                setId: set.id,
                userId: parseInt(userId),
                type: 0,
                extra: false
            });
        }
    // Only add extra numbers if they do not already exist in numbers
    if (set.extraNumbers) {
        try {
            const setNumbers = JSON.parse(set.extraNumbers);
            setNumbers.forEach(nr => {
                if (!numbers.find(n => n.number.toString() === nr.number.toString())) {
                    numbersArray.push({
                        number: nr.number.toString(),
                        setId: set.id,
                        userId: parseInt(userId),
                        type: 0,
                        desc: nr.desc,
                        extra: true
                    });
                }
            });
        } catch (e) {}
    }

    // Merge: always prefer backend numbers for existing, only add new ones
    const mergedNumbers = numbers.concat(numbersArray.filter(aa => !numbers.find(bb => aa.number === bb.number)));

    // Check if all values are numeric
    const allNumeric = mergedNumbers.every(item => !isNaN(parseFloat(item.number)));

    // Only sort if all values are numeric
    if (allNumeric) {
        return mergedNumbers.sort((a, b) => parseFloat(a.number) - parseFloat(b.number));
    }

    return mergedNumbers; // Return unsorted if any non-numeric values
}


const _mergeArrays = (a, b, p) => {
    return a.filter(aa => !b.find(bb => aa[p] === bb[p])).concat(b);
}

// Example test data
// const turbo121 = [{"number":"124","desc":"BMW 318"},{"number": "131", "desc": "pEntera"}, {"number": "144", "desc": "Motor: 1500cc"}, {"number": "149", "desc": "Diablo"}, {"number": "159", "desc": "SL 300"}, {"number": "188", "desc": "Voltswagen"}]
// const sindy = [{"number":"1","desc":"3rd Number"}, {"number": "2", "desc": "3rd Number"}, {"number": "6", "desc": "3rd Number"}, {"number": "7", "desc": "3rd Number"}]
// const sindy2 = [{"number": "1", "desc": "4th Number"}]
// const flinstones = [{"number": "36", "desc": "Mirrored Bottom Text"}]
// const cincin = [{"number": "7", "desc": "UK Flag" }, { "number": "9", "desc": "Syria Flag" }, { "number": "17", "desc": "UK Flag" }, { "number": "27", "desc": "UK Flag" }, { "number": "39", "desc": "UK Flag" }, { "number": "50", "desc": "UK Flag" }, { "number": "59", "desc": "UK Flag" }, { "number": "64", "desc": "Syria Flag" }, { "number": "67", "desc": "UK Flag" }]
