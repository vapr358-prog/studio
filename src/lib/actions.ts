"use server";

import { z } from "zod";
import { personalizedCakeRecommendations } from "@/ai/flows/personalized-cake-recommendations";
import { orders, mockUser } from "./data";

export type RecommendationState = {
  recommendations?: string[];
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
  const selectedFlavors = formData.getAll("flavors");

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
      trendingCakes: ['Cheesecake Artesanal Premium', 'Tarta de Zanahoria y Nueces'], // Optional: example of trending cakes
    });
    
    return { recommendations: aiResponse.recommendedCakes, timestamp: Date.now() };

  } catch (e) {
    console.error(e);
    return {
      error: "No pudimos obtener tus recomendaciones en este momento. Por favor, inténtalo de nuevo más tarde.",
      timestamp: Date.now(),
    };
  }
}
