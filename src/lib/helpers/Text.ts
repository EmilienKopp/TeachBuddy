export function capitalize(str: string): string {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

export function formatMG(nb: number): string {
    if (nb > 1_000_000_000) {
        return (nb / 1_000_000_000).toFixed(1) + 'G';
    } else if (nb > 1_000_000) {
        return (nb / 1_000_000).toFixed(1) + 'M';
    } else {
        return nb.toString();
    }
}

export function splitWords(input: string): string[] | RegExpMatchArray {
    if(!input) return [];
    
    const regex = /(\S+|\n|\t)/g; // Matches words, line breaks, and tabs
    const tabbedInput = input.replace(/ {4}/g, '\t'); // Replace 4 spaces with a tab
    return tabbedInput.match(regex) ?? ['No content'];
}

export function extractPunctuationAndPad(input: string): object {
    const regex = /^(\S*?)([,.:;!?]+)(.*)/;
    const match = input.match(regex);
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

export function removePunctuation(word: string): string {
    return word.replace(/[.?,\/#!$%\^&\*;":{}=\-_`~()]/g, "").replace('\'s', '');
}

export function strLimit(str: string, limit: number, end: string = '...'): string {
    return str.length > limit ? str.slice(0, limit) + end : str;
}

export function strLimitByWords(str: string, limit: number, end: string = '...'): string {
    const words = str.split(' ');
    return words.length > limit ? words.slice(0, limit).join(' ') + end : str;
}

export function XSVto2dArray(content: string, delimiter = ',', noBlankRows = true): string[][] {
    return content?.split('\r\n')
            .map((line) => line.split(delimiter).filter((cell) => cell.trim() != '') )
            .filter((row) => row.some((cell) => (cell.trim() != '') || !noBlankRows));
}

export function XSVtoObjectArray(content: string, delimiter = ',', noBlankRows = true): object[] {
    const [headers, ...rows] = XSVto2dArray(content, delimiter, noBlankRows);
    return rows.map((row) => {
        const obj = {} as any;
        row.forEach((cell, i) => {
            obj[headers[i]] = cell;
        });
        return obj;
    });
}