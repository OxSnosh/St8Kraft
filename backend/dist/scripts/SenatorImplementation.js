"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kMostFrequent = void 0;
function kMostFrequent(nums, k) {
    // Frequency counter
    let freqs = {};
    let num;
    for (num of nums) {
        if (freqs[num] === undefined) {
            freqs[num] = 1;
        }
        else {
            freqs[num] = freqs[num] + 1;
        }
    }
    // Convert to array with [frequency, number] elements
    let frequencyArray = [];
    let key;
    for (key in freqs) {
        frequencyArray.push([freqs[key], key]);
    }
    // Sort in descending order with frequency as key
    frequencyArray.sort((a, b) => {
        return b[0] - a[0];
    });
    // Get most frequent element out of array
    let mostFreq = [];
    for (let i = 0; i < k; i++) {
        mostFreq.push(frequencyArray[i][1]);
    }
    return mostFreq;
}
exports.kMostFrequent = kMostFrequent;
;
