// @ts-nocheck


export function splitWords(input) {
    if(!input) return [];
    
    const regex = /(\S+|\n|\t)/g; // Matches words, line breaks, and tabs
    const tabbedInput = input.replace(/ {4}/g, '\t'); // Replace 4 spaces with a tab
    return tabbedInput.match(regex);
}

export function extractPunctuationAndPad(input) {
    const regex = /^(\S*?)([,.:;!?]+)(.*)/;
    const match = input.match(regex);
    console.log(input, match);
    if (!match) {
        return {word: input, punctuation: ''};
    } else {
        const [_, word, punctuation, rest] = match;
        return {
            word: word,
            punctuation: punctuation + ' ',
        }
    }
}

export function removePunctuation(word) {
    return word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
}

export function strLimit(str, limit, end = '...') {
    return str.length > limit ? str.slice(0, limit) + end : str;
}

export function strLimitByWords(str, limit, end = '...') {
    const words = str.split(' ');
    return words.length > limit ? words.slice(0, limit).join(' ') + end : str;
}