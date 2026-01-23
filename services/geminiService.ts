import { GoogleGenerativeAI } from "google-generative-ai";
import { UserProfile, DietPlan, FoodAnalysis } from "../types";

// ⚠️ TU CLAVE API
const API_KEY = "AIzaSyCzNudeombMbkCSc2an6iL8GiU-GSckMwg";
const genAI = new GoogleGenerativeAI(API_KEY);

// ✅ USAMOS EL MODELO FLASH (Funciona mejor en Europa)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateDietPlan = async (profile: UserProfile): Promise<DietPlan> => {
  try {
    const prompt = `
      Actúa como nutricionista experto. Crea una dieta diaria basada en:
      - Datos: ${profile.gender}, ${profile.age} años, ${profile.weight}kg, ${profile.height}cm.
      - Objetivo: ${profile.goal}.
      
      IMPORTANTE: Responde SOLO con un JSON válido con esta estructura exacta:
      {
        "dailyCalories": 2000,
        "macros": { "protein": 150, "carbs": 200, "fats": 60 },
        "meals": {
          "breakfast": { "name": "Ejemplo", "calories": 500, "protein": 30, "carbs": 50, "fats": 20, "description": "Algo rico" },
          "lunch": { "name": "Ejemplo", "calories": 700, "protein": 40, "carbs": 80, "fats": 25, "description": "Algo rico" },
          "snack": { "name": "Ejemplo", "calories": 300, "protein": 20, "carbs": 30, "fats": 10, "description": "Algo rico" },
          "dinner": { "name": "Ejemplo", "calories": 500, "protein": 30, "carbs": 40, "fats": 15, "description": "Algo rico" }
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Limpieza de seguridad
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
          parts: [{ text: `Soy ${profile.gender}, peso ${profile.weight}kg. Meta: ${profile.goal}.` }],
        },
        {
          role: "model",
          parts: [{ text: "Hola, soy NutriBot. ¿En qué te ayudo hoy?" }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error en chat:", error);
    return "Error de conexión (posible bloqueo de región).";
  }
};

export const analyzeFoodImage = async (base64Image: string): Promise<FoodAnalysis> => {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image.split(',')[1] || base64Image,
        mimeType: "image/jpeg",
      },
    };

    const prompt = "Analiza esta comida. JSON: dishName, estimatedCalories, macros {protein, carbs, fats}, ingredients (array).";

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
    const result = await model.generateContent(`Lista de la compra para: ${JSON.stringify(dietPlan)}`);
    return result.response.text();
  } catch (error) {
    return "Error generando lista.";
  }
};
