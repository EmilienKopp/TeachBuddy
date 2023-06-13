
export const WeblioEndpoint = 'https://ejje.weblio.jp/content/';

export function searchWeblio(word: string) {
    window.open(WeblioEndpoint + word, '_blank');
}