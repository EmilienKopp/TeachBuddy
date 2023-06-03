// @ts-nocheck

import { AZURE_API_KEY } from '$env/static/private';
import { TranslationServiceClient } from '@google-cloud/translate';
import { json } from '@sveltejs/kit';

// const translate = new Translate({ projectId: '' });
const GT = new TranslationServiceClient();
// https://api.cognitive.microsofttranslator.com/dictionary/lookup?api-version=3.0

const projectId = 'page-turner-388715';
const location = 'global';

const apiVersion = "3.0";

const headers = {
    "Ocp-Apim-Subscription-Key": AZURE_API_KEY,
    "Ocp-Apim-Subscription-Region": "japaneast",
    "Content-type": "application/json",

}


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { text, source: from, target: to } = await request.json();
    console.log('REQUEST', text, from, to);

    const body = JSON.stringify([
        { Text: text }
    ]);

    const response = await fetch(`https://api.cognitive.microsofttranslator.com/dictionary/lookup?api-version=${apiVersion}&from=${from}&to=${to}`,{
            method: "POST",
            headers: {
                ...headers,
                "Content-Length": Buffer.byteLength(body, 'utf8').toString(),
            },
            body,
        });
    
    const [data] = await response.json();
    
    const to_var = to+"_word";

    data.translations = data.translations.map((translation) => {
        return  {
            word: text, 
            [to_var]: translation.normalizedTarget, 
            POS: translation.posTag, 
            prefix_word: translation.prefixWord, 
            back_translations: translation.backTranslations
        }; 
    });

    
    
    return json({translations: data.translations});
}
