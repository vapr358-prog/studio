// src/lib/actions.ts
"use server";

import { z } from "zod";
// Importamos la función que me acabas de pasar
import { personalizedCakeRecommendations } from "@/ai/flows/personalized-cake-recommendations";
import { orders } from "./data";

export type RecommendationState = {
  recommendations?: string[];
  explanation?: string; // Añadimos la explicación que genera tu IA
  error?: string;
  timestamp?: number;
};

const schema = z.object({
  flavors: z.array(z.string()).min(1, { message: "Por favor, selecciona al menos un sabor." }),
});

export async function getCakeRecommendations(
  prevState: RecommendationState,
  formData: FormData
): Promise<RecommendationState> {
  const selectedFlavors = formData.getAll("flavors") as string[];

  const validatedFields = schema.safeParse({
    flavors: selectedFlavors,
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.flavors?.join(", "),
      timestamp: Date.now(),
    };
  }
  
  try {
    // 1. Obtenemos el historial real del usuario
    const userOrderHistory = orders
      .filter(order => order.status === 'Entregado')
      .flatMap(order => order.items.map(item => item.name));

    // 2. LLAMADA AL FLOW DE GENKIT
    // Importante: Pasamos los parámetros tal cual los pide tu esquema de entrada
    const aiResponse = await personalizedCakeRecommendations({
      orderHistory: userOrderHistory,
      flavorPreferences: validatedFields.data.flavors,
      trendingCakes: ['tarta-de-chocolate', 'red-velvet'], 
    });
    
    // 3. Devolvemos los IDs y la explicación amable
    return { 
      recommendations: aiResponse.recommendedCakes, 
      explanation: aiResponse.explanation,
      timestamp: Date.now() 
    };

  } catch (e) {
    console.error("Error en Genkit Flow:", e);
    return {
      error: "La IA está descansando en la cocina. Inténtalo en un momento.",
      timestamp: Date.now(),
    };
  }
}