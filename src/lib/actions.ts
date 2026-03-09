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
 * Procesa un pedido simulado con gestión de errores robusta
 */
export async function processOrder(cart: any[]) {
  try {
    // Simulación de validación de servidor
    if (!cart || cart.length === 0) {
      return {
        success: false,
        message: "El carrito está vacío.",
      };
    }

    console.log("Procesando pedido de Sweet Queen:", cart);
    
    // Simulamos un retraso de red (ej: comunicación con pasarela de pago)
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      success: true,
      message: "Pedido recibido con éxito",
    };
  } catch (error) {
    console.error("Error crítico procesando el pedido:", error);
    return {
      success: false,
      message: "Lo sentimos, ha ocurrido un error técnico. Inténtalo de nuevo.",
    };
  }
}
