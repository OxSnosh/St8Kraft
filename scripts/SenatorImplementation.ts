

export function kMostFrequent(nums : any , k : any) {
    // Frequency counter
    let freqs : any = {};
    let num;
    for (num of nums) {
        if (freqs[num] === undefined) { 
            freqs[num] = 1; 
        } else {
            freqs[num] = freqs[num] + 1;
        }
    }
    
    // Convert to array with [frequency, number] elements
    let frequencyArray : any = [];
    let key;
    for (key in freqs) {
        frequencyArray.push([freqs[key], key]);
    }
    
    // Sort in descending order with frequency as key
    frequencyArray.sort((a : any, b : any) => {
        return b[0] - a[0];
    });
    
    // Get most frequent element out of array
    let mostFreq : any = [];
    for (let i = 0; i < k; i++) {
        mostFreq.push(frequencyArray[i][1]);
    }

    return mostFreq;
};