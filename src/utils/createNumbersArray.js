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

    // Separate main and extra numbers
    const mainNumbers = mergedNumbers.filter(item => !item.extra);
    const extraNumbers = mergedNumbers.filter(item => item.extra);
    
    // Check if all main values are numeric
    const allMainNumeric = mainNumbers.every(item => !isNaN(parseFloat(item.number)));
    
    // Sort only main numbers if they are all numeric
    if (allMainNumeric) {
        mainNumbers.sort((a, b) => parseFloat(a.number) - parseFloat(b.number));
    }
    
    // Preserve original order of extra numbers from set.extraNumbers
    let orderedExtraNumbers = extraNumbers;
    if (set.extraNumbers) {
        try {
            const originalExtraOrder = JSON.parse(set.extraNumbers);
            // Sort extra numbers according to their original order in set.extraNumbers
            orderedExtraNumbers = extraNumbers.sort((a, b) => {
                const aIndex = originalExtraOrder.findIndex(n => n.number.toString() === a.number.toString());
                const bIndex = originalExtraOrder.findIndex(n => n.number.toString() === b.number.toString());
                return aIndex - bIndex;
            });
        } catch (e) {}
    }
    
    // Return main numbers sorted + extra numbers in original order
    return [...mainNumbers, ...orderedExtraNumbers];
}
// Example test data
// const turbo121 = [{"number":"124","desc":"BMW 318"},{"number": "131", "desc": "pEntera"}, {"number": "144", "desc": "Motor: 1500cc"}, {"number": "149", "desc": "Diablo"}, {"number": "159", "desc": "SL 300"}, {"number": "188", "desc": "Voltswagen"}]
// const sindy = [{"number":"1","desc":"3rd Number"}, {"number": "2", "desc": "3rd Number"}, {"number": "6", "desc": "3rd Number"}, {"number": "7", "desc": "3rd Number"}]
// const sindy2 = [{"number": "1", "desc": "4th Number"}]
// const flinstones = [{"number": "36", "desc": "Mirrored Bottom Text"}]
// const cincin = [{"number": "7", "desc": "UK Flag" }, { "number": "9", "desc": "Syria Flag" }, { "number": "17", "desc": "UK Flag" }, { "number": "27", "desc": "UK Flag" }, { "number": "39", "desc": "UK Flag" }, { "number": "50", "desc": "UK Flag" }, { "number": "59", "desc": "UK Flag" }, { "number": "64", "desc": "Syria Flag" }, { "number": "67", "desc": "UK Flag" }]
