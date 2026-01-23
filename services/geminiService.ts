import { GoogleGenerativeAI } from "google-generative-ai";
import { UserProfile, DietPlan, FoodAnalysis } from "../types";

// ⚠️ TU CLAVE API
const API_KEY = "AIzaSyCzNudeombMbkCSc2an6iL8GiU-GSckMwg";
const genAI = new GoogleGenerativeAI(API_KEY);

// Usamos el modelo flash (rápido y barato)
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
export const generateDietPlan = async (profile: UserProfile): Promise<DietPlan> => {
  try {
    const prompt = `
      Actúa como nutricionista experto. Crea una dieta diaria basada en estos datos:
      - Datos: ${profile.gender}, ${profile.age} años, ${profile.weight}kg, ${profile.height}cm.
      - Objetivo: ${profile.goal} (${profile.dietType || 'balanceada'}).
      
      IMPORTANTE: Responde SOLO con un JSON válido (sin texto extra) con esta estructura:
      {
        "dailyCalories": 2000,
        "macros": { "protein": 150, "carbs": 200, "fats": 60 },
        "meals": {
          "breakfast": { "name": "Nombre", "calories": 500, "protein": 30, "carbs": 50, "fats": 20, "description": "Descripción breve" },
          "lunch": { "name": "Nombre", "calories": 700, "protein": 40, "carbs": 80, "fats": 25, "description": "Descripción breve" },
          "snack": { "name": "Nombre", "calories": 300, "protein": 20, "carbs": 30, "fats": 10, "description": "Descripción breve" },
          "dinner": { "name": "Nombre", "calories": 500, "protein": 30, "carbs": 40, "fats": 15, "description": "Descripción breve" }
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Limpiamos el texto por si la IA pone comillas de código
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generando dieta:", error);
    throw error;
  }
};

export const chatWithNutriBot = async (message: string, profile: UserProfile) => {
  try {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `Soy ${profile.gender}, peso ${profile.weight}kg. Mi meta es ${profile.goal}. Actúa como mi coach nutricional NutriBot.` }],
        },
        {
          role: "model",
          parts: [{ text: "¡Entendido! Soy NutriBot, tu coach personal. Estoy listo para ayudarte a alcanzar tu meta. ¿Qué necesitas hoy?" }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error en chat:", error);
    return "Lo siento, tuve un problema de conexión. Inténtalo de nuevo.";
  }
};

export const analyzeFoodImage = async (base64Image: string): Promise<FoodAnalysis> => {
  try {
    // Convertimos base64 a formato compatible con Google
    const imagePart = {
      inlineData: {
        data: base64Image.split(',')[1] || base64Image, // Quitamos el header si existe
        mimeType: "image/jpeg",
      },
    };

    const prompt = "Analiza esta imagen de comida. Responde SOLO en JSON con: dishName, estimatedCalories (número), macros {protein, carbs, fats}, ingredients (array de strings).";

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    let text = response.text();

    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error visión:", error);
    throw error;
  }
};

export const generateShoppingList = async (dietPlan: DietPlan) => {
  try {
    const result = await model.generateContent(`Crea una lista de la compra basada en este plan: ${JSON.stringify(dietPlan)}`);
    return result.response.text();
  } catch (error) {
    return "No se pudo generar la lista.";
  }
};
