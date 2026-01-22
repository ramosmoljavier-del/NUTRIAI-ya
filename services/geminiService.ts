import { GoogleGenAI } from "@google/genai";
import { UserProfile, DietPlan, FoodAnalysis } from "../types";

// ⚠️ TU CLAVE API
const ai = new GoogleGenAI({ apiKey: "AIzaSyCzNudeombMbkCSc2an6iL8GiU-GSckMwg" });

// MODELO (Usamos el flash 1.5)
const MODEL_NAME = 'gemini-1.5-flash';

export const generateDietPlan = async (profile: UserProfile): Promise<DietPlan> => {
  try {
    const activityFactors: Record<string, number> = {
      sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9
    };
    const factor = activityFactors[profile.activityLevel] || 1.2;

    const prompt = `Actúa como Nutricionista. Calcula con Mifflin-St Jeor:
    - Usuario: ${profile.gender}, ${profile.age} años, ${profile.weight}kg, ${profile.height}cm.
    - Objetivo: ${profile.goal} (Factor ${factor}).
    - Dieta: ${profile.dietType}.
    
    Genera un plan diario JSON válido con esta estructura exacta:
    {
      "dailyCalories": número,
      "macros": { "protein": número, "carbs": número, "fats": número },
      "meals": {
        "breakfast": { "name": "...", "calories": 0, "protein": 0, "carbs": 0, "fats": 0, "description": "..." },
        "lunch": { ...igual... },
        "snack": { ...igual... },
        "dinner": { ...igual... }
      }
    }`;

    // CONFIGURACIÓN "SAFE MODE" (Sin tipos estrictos para evitar errores)
    const config: any = {
      responseMimeType: "application/json",
    };

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: config
    });

    // Intentamos obtener el texto de forma segura
    let text = "";
    if (typeof response.text === 'function') {
        text = response.text(); 
    } else if (typeof response.text === 'string') {
        text = response.text;
    } else {
        // Fallback para estructuras raras de respuesta
        text = JSON.stringify(response); 
    }

    // Limpieza por si la IA añade comillas extra
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    console.log("Respuesta IA Dieta:", cleanText); // Para depurar si falla
    return JSON.parse(cleanText);

  } catch (error) {
    console.error("ERROR CRÍTICO EN DIETA:", error);
    throw error;
  }
};

export const chatWithNutriBot = async (message: string, profile: UserProfile) => {
  try {
    const context = `Eres NutriBot. Usuario: ${profile.weight}kg, Meta: ${profile.goal}. Responde breve y motivador en español.`;
    
    const chat = ai.chats.create({
      model: MODEL_NAME,
      config: { systemInstruction: context }
    });
    
    const response = await chat.sendMessage({ part: { text: message } });
    
    // Extracción segura del texto
    let text = "";
    if (typeof response.text === 'function') {
        text = response.text();
    } else if (typeof response.text === 'string') {
        text = response.text;
    }

    return text || "No pude procesar eso.";
  } catch (error) {
    console.error("ERROR CHAT:", error);
    return "Error de conexión con NutriBot.";
  }
};

export const analyzeFoodImage = async (base64Image: string): Promise<FoodAnalysis> => {
  try {
    const imagePart = { inlineData: { mimeType: 'image/jpeg', data: base64Image } };
    const prompt = "Analiza esta comida. Responde SOLO en JSON con: dishName, estimatedCalories, macros (protein, carbs, fats), ingredients (array strings).";

    const config: any = { responseMimeType: "application/json" };

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { role: "user", parts: [imagePart, { text: prompt }] },
      config: config
    });

    let text = "";
    if (typeof response.text === 'function') {
        text = response.text();
    } else if (typeof response.text === 'string') {
        text = response.text;
    }

    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("ERROR VISION:", error);
    throw error;
  }
};

export const generateShoppingList = async (dietPlan: DietPlan) => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Crea lista de compra para: ${JSON.stringify(dietPlan)}`
    });
    
    let text = "";
    if (typeof response.text === 'function') {
        text = response.text();
    } else if (typeof response.text === 'string') {
        text = response.text;
    }
    return text || "Error generando lista.";
  } catch (error) {
    return "Error generando lista.";
  }
};
