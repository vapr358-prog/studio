// src/lib/actions.ts
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
    console.error("Error en Genkit Flow:", e);
    return {
      error: "La IA está descansando en la cocina. Inténtalo en un momento.",
      timestamp: Date.now(),
    };
  }
}

/**
 * Procesa un pedido simulado
 */
export async function processOrder(cart: any[]) {
  // Aquí iría la lógica de integración con Stripe o base de datos de pedidos real
  console.log("Procesando pedido de Sweet Queen:", cart);
  
  // Simulamos un retraso de red
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    success: true,
    message: "Pedido recibido con éxito",
  };
}
