"use server";

import { z } from "zod";
import { personalizedCakeRecommendations } from "@/ai/flows/personalized-cake-recommendations";
import { orders } from "./data";

export type RecommendationState = {
  recommendations?: string[];
  explanation?: string;
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
    const userOrderHistory = orders
      .filter(order => order.status === 'Entregado')
      .flatMap(order => order.items.map(item => item.name));

    const aiResponse = await personalizedCakeRecommendations({
      orderHistory: userOrderHistory,
      flavorPreferences: validatedFields.data.flavors,
      trendingCakes: ['tarta-de-chocolate', 'red-velvet'],
    });
    
    return { 
      recommendations: aiResponse.recommendedCakes, 
      explanation: aiResponse.explanation,
      timestamp: Date.now() 
    };

  } catch (e) {
    console.error(e);
    return {
      error: "No pudimos obtener tus recomendaciones en este momento. Por favor, inténtalo de nuevo más tarde.",
      timestamp: Date.now(),
    };
  }
}
