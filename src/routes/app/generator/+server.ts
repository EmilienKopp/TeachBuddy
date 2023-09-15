import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

import { GrammarStructure } from '$lib/models/GrammarStructure';
import { Language } from '$lib/models/Language';
import { OPENAI_API_KEY } from '$env/static/private';
import { Passage } from '$lib/models/Passage';
import { PassageType } from '$lib/models/PassageType.js';
import { Profile } from '$lib/models/Profile';
import { QualityLevel } from '$lib/models/QualityLevel.js';
import type { RequestEvent } from './$types';
import { Vocabulary } from '$lib/models/Vocabulary.js';
import { costToGenerate } from '$lib/logic/points.js';
import { isAllowedToGenerate } from '$lib/logic/passages.js';

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
    apiKey: OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);


export async function POST({ request, locals: { supabase, getSession, getProfile } }: RequestEvent) {
    console.log('POST /app/generator');
    const profile = await getProfile();

    const { customPrompt, type, language, length, quality, grammar_points } = await request.json();
    
    // Content type
    const passageType = await PassageType.find(type);
    const contentTypeString = passageType?.name_en ?? 'passage';

    // Quality
    const qualityData = await QualityLevel.find(quality);
    const model = qualityData?.ai_model;
    const qualityMultiplier = qualityData?.multiplier;

    // Language
    let lang;
    const targetLanguage = await Language.find(language);
    const sourceLanguage = await Language.find(profile.native_language);
    // Deal with the fact that some languages have composite names
    if (targetLanguage) {
        let split = targetLanguage.name_en.split(';');
        lang = split.length > 0 ? split[split.length - 1] : targetLanguage.name_en;
    } else {
        lang = 'English';
    }

    // Word list
    const vocabFilter = { orderBy: 'frequency', direction: "desc", limit: 600} as const;
    const vocabData = await Vocabulary.where('language', 'eq',targetLanguage.lang_code, vocabFilter);
    const wordList = vocabData.vertical('word');

    // Grammar points
    
    const allGrammarPoints = await GrammarStructure.select('name');
    const grammarPointsToAvoid = allGrammarPoints.filter( (el) => !grammar_points.includes(el))
                                                 .map( (el: string) => el.replace('_', ' '));

    console.log('Grammar points: ', grammarPointsToAvoid);
    

    // Prompt
    let content = `
          ${wordList.length > 0 ? `The ${wordList.length} most common words in ${lang} are: [${wordList}]. Use the words above to w` : 'W'}rite a 
          ${contentTypeString} understandable by a beginner student who has no more than 600 words of vocabulary. Keep the grammar very simple. 
          Avoid colloquialisms and slang.
          The theme might provided in a non ${lang} language, but the passage has to be in ${lang}. The theme is: "${customPrompt}". 
          Provide the passage in ${lang}.
          The passage won't be longer than ${length} words.
          You will avoid the following grammar structures: ${grammarPointsToAvoid}.
          You will provide a TITLE for the passage at the top.
          Finally, ask a COMPREHENSION QUESTION about the passage (not a yes/no question).
          You will provide a list of 'the 10 most difficult words' with their translation
          in ${sourceLanguage?.name_en ?? 'Japanese'} after the passage.
          
          TITLE:

          PASSAGE:
          `;


    if (! await isAllowedToGenerate(supabase, profile, length, qualityMultiplier, quality))
        return new Response('You do not have enough points to generate this passage.', { status: 403 });

    console.log('Callign generator with prompt: ', content);
    const passage = await Passage.from({
        content: content,
        owner_id: profile.id,
        prompt: customPrompt,
        language: language,
        quality: quality,
        type_id: type,
    });

    const { data: actionsData, error: actionsError } = await supabase.from('actions').select('*').eq('verb', 'generate').single();
    const { data: pointsData, error: pointsError } = await supabase.from('points_master').select('amount, multiplier').eq('action_id', actionsData.id).single();

    const cost = costToGenerate(length, pointsData?.multiplier);

    const { data: updateData, error } = await supabase.from('profiles').update({ point_balance: profile.point_balance - cost }).eq('id', profile.id).select();


    // Ask OpenAI for a streaming completion given the prompt
    const response = await openai.createChatCompletion({
        model: model,
        stream: true,
        temperature: 0.6,
        messages: [ {role: "user", content: `${content}`}],
        // prompt: `${content}`,
    });


    let start: number, end: number;
    let word_count = 0;

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response, {
        onStart: async () => {
            start = performance.now();
        },
        onToken: async () => {
            word_count++;
        },
        onCompletion: async (completion: string) => {
            console.log('PASSAGE GENERATED');
            const generation_duration = Math.round(performance.now() - start);

            const firstLine = completion.split('\n')[0];
            const title = firstLine.toLowerCase().includes('title:') ? firstLine.split(':')[1] : '';
            if(title) completion.replace(firstLine,'');

            await passage.store({
                title: title,
                content: completion,
                word_count: word_count,
                generation_duration: generation_duration,
            });
        },
    });

    // Respond with the stream
    const streamingResponse = new StreamingTextResponse(stream);
    return streamingResponse;
}