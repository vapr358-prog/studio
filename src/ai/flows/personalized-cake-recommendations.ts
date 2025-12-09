'use server';

/**
 * @fileOverview A personalized cake recommendation AI agent.
 *
 * - personalizedCakeRecommendations - A function that handles the personalized cake recommendation process.
 * - PersonalizedCakeRecommendationsInput - The input type for the personalizedCakeRecommendations function.
 * - PersonalizedCakeRecommendationsOutput - The return type for the personalizedCakeRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedCakeRecommendationsInputSchema = z.object({
  orderHistory: z
    .array(z.string())
    .describe('The list of cake names the user has previously ordered.'),
  flavorPreferences: z
    .array(z.string())
    .describe('The list of flavor preferences selected by the user.'),
  trendingCakes: z
    .array(z.string())
    .optional()
    .describe('An optional list of trending cake names.'),
});
export type PersonalizedCakeRecommendationsInput = z.infer<
  typeof PersonalizedCakeRecommendationsInputSchema
>;

const PersonalizedCakeRecommendationsOutputSchema = z.object({
  recommendedCakes: z
    .array(z.string())
    .describe('A list of recommended cake names based on user history and preferences.'),
});
export type PersonalizedCakeRecommendationsOutput = z.infer<
  typeof PersonalizedCakeRecommendationsOutputSchema
>;

export async function personalizedCakeRecommendations(
  input: PersonalizedCakeRecommendationsInput
): Promise<PersonalizedCakeRecommendationsOutput> {
  return personalizedCakeRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedCakeRecommendationsPrompt',
  input: {schema: PersonalizedCakeRecommendationsInputSchema},
  output: {schema: PersonalizedCakeRecommendationsOutputSchema},
  prompt: `Eres un experto en pastelería y recomiendas pasteles a los clientes en función de su historial de pedidos y sus preferencias de sabor.

Historial de pedidos del cliente:
{{#if orderHistory}}
  {{#each orderHistory}}
  - {{this}}
  {{/each}}
{{else}}
  Ningún pedido anterior.
{{/if}}

Preferencias de sabor del cliente:
{{#if flavorPreferences}}
  {{#each flavorPreferences}}
  - {{this}}
  {{/each}}
{{else}}
  Ninguna preferencia de sabor especificada.
{{/if}}

{{#if trendingCakes}}
  Pasteles en tendencia:
  {{#each trendingCakes}}
  - {{this}}
  {{/each}}
{{/if}}

Recomienda pasteles que el usuario no haya pedido antes, basándote en sus gustos y en el historial. Limítate a la lista de nombres de pasteles recomendados.  No incluyas ninguna otra información en tu respuesta.
`,
});

const personalizedCakeRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedCakeRecommendationsFlow',
    inputSchema: PersonalizedCakeRecommendationsInputSchema,
    outputSchema: PersonalizedCakeRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
