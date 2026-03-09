import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// ESTO ES PARA DIAGNÓSTICO
console.log("¿La clave existe?:", !!process.env.GOOGLE_GENAI_API_KEY);

export const ai = genkit({
  plugins: [
    googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY }),
  ],
  model: 'googleai/gemini-1.5-flash',
});