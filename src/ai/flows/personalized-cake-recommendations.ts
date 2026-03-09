'use server';

/**
 * @fileOverview A personalized cake recommendation AI agent: The "Sumiller de Pasteles".
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
    .describe('El historial de nombres de pasteles que el usuario ha pedido.'),
  flavorPreferences: z
    .array(z.string())
    .describe('La lista de preferencias de sabor seleccionadas por el usuario.'),
  trendingCakes: z
    .array(z.string())
    .optional()
    .describe('Lista opcional de pasteles en tendencia.'),
});
export type PersonalizedCakeRecommendationsInput = z.infer<
  typeof PersonalizedCakeRecommendationsInputSchema
>;

const PersonalizedCakeRecommendationsOutputSchema = z.object({
  recommendedCakes: z
    .array(z.string())
    .describe('Un array con los IDs de los pasteles recomendados (ej: ["tarta-de-chocolate", "carrot-cake"]).'),
  explanation: z
    .string()
    .describe('Una frase amable explicando la elección basada en el historial y gustos.'),
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
  prompt: `Rol: Eres el "Sumiller de Pasteles" de la pastelería Sweet Queen. Tu objetivo es recomendar el pastel perfecto para un cliente basándote en sus gustos actuales y su historial de compras.

Reglas de Oro:
1. Solo productos reales: Solo puedes recomendar pasteles que existan en el catálogo.
2. Justificación: Debes explicar brevemente por qué recomiendas esos pasteles.
3. Personalización: Si el cliente tiene un historial de "Tarta Vainilla", busca sabores complementarios o versiones premium.

Catálogo de IDs y descripción:
- tarta-de-chocolate: Chocolate intenso, dulce.
- carrot-cake: Zanahoria, nueces, especiado.
- tarta-tres-leches-fruta-fresca: Húmeda, vainilla, frutal.
- tarta-vainilla: Clásica, artesanal, suave.
- red-velvet: Elegante, cacao suave, queso crema.
- tarta-personalizada: Diseño a medida, artesanal.
- mini-tarta-personal-especial: Opción individual.
- cupcakes-artesanales: Pequeños bocados decorados.

Contexto del Usuario:
- Historial de pedidos: {{#each orderHistory}}{{this}}{{#unless @last}}, {{/unless}}{{else}}Sin pedidos previos{{/each}}
- Gustos actuales: {{#each flavorPreferences}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}

Devuelve los 2 mejores IDs y una explicación amable.`,
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
