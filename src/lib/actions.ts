// src/lib/actions.ts
"use server";

import { z } from "zod";
import { personalizedCakeRecommendations } from "@/ai/flows/personalized-cake-recommendations";
import { orders } from "./data";
import { SHEETDB_API_URL } from "./config";

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
 * Procesa un pedido de la tienda y lo registra en Google Sheets (hoja solicitudes)
 */
export async function processOrder(cart: any[], userInfo: { username: string, paymentMethod?: string }) {
  try {
    if (!cart || cart.length === 0) {
      return {
        success: false,
        message: "El carrito está vacío.",
      };
    }

    // Preparar datos para el Excel
    const orderId = `SQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const fechaHoy = new Date().toLocaleDateString('es-ES');
    const usuario = userInfo.username || "Invitado";
    
    // Formatear detalles del pedido (productos del carrito)
    const detallesPedido = cart.map(item => 
      `${item.name.es || item.name} (x${item.quantity})`
    ).join(' | ');

    const infoCompleta = `Tienda: ${detallesPedido} | Pago: ${userInfo.paymentMethod || 'No especificado'}`;

    const payload = {
      data: [{
        id: orderId,
        fecha: fechaHoy,
        usuario: usuario,
        estado: 'Pendiente',
        detalles: infoCompleta
      }]
    };

    // Enviar a SheetDB
    const res = await fetch(`${SHEETDB_API_URL}?sheet=solicitudes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("No se pudo conectar con la base de datos de pedidos.");
    }

    return {
      success: true,
      message: "Pedido recibido con éxito",
      orderId: orderId
    };
  } catch (error) {
    console.error("Error crítico procesando el pedido:", error);
    return {
      success: false,
      message: "Lo sentimos, ha ocurrido un error técnico al registrar tu pedido.",
    };
  }
}
