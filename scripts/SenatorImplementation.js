

let nums = [1, 1, 2, 3, 5, 5, 1]

const kMostFrequent = function(nums, k) {
    // Frequency counter
    let freqs = {};
    for (num of nums) {
        if (freqs[num] === undefined) { 
            freqs[num] = 1; 
        } else {
            freqs[num] = freqs[num] + 1;
        }
    }
    
    // Convert to array with [frequency, number] elements
    let frequencyArray = [];
    for (key in freqs) {
        frequencyArray.push([freqs[key], key]);
    }
    
    // Sort in descending order with frequency as key
    frequencyArray.sort((a, b) => {
        return b[0] - a[0];
    });
    
    // Get most frequent element out of array
    mostFreq = [];
    for (let i = 0; i < k; i++) {
        mostFreq.push(frequencyArray[i][1]);
    }
    
    console.log(mostFreq);
    return mostFreq;
};

kMostFrequent(nums, 2);