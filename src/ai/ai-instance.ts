'use server';
/ ai/ai-instance.ts
import {GenkitAILocal} from '@genkit-ai/googleai';
import {init} from 'genkit';

const model = new GenkitAILocal({
  model: 'gemini-1.5-pro-002',
});

export const ai = init({defaultModel: model});
