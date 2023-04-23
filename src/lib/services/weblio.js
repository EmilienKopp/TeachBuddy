
export const WeblioEndpoint = 'https://ejje.weblio.jp/content/';

export function searchWeblio(word) {
    window.open(WeblioEndpoint + word, '_blank');
}