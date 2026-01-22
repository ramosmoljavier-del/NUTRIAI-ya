import { GoogleGenAI, SchemaType } from "@google/genai";
import { UserProfile, DietPlan, FoodAnalysis } from "../types";

// ⚠️ TU CLAVE API (NO LA BORRES)
const ai = new GoogleGenAI({ apiKey: "AIzaSyCzNudeombMbkCSc2an6iL8GiU-GSckMwg" });

// MODELO ESTABLE (Usamos el 1.5 que no falla)
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
    
    Genera un plan diario JSON válido con: dailyCalories, macros (protein, carbs, fats), y meals (breakfast, lunch, snack, dinner).`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME, 
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            dailyCalories: { type: SchemaType.NUMBER },
            macros: {
              type: SchemaType.OBJECT,
              properties: {
                protein: { type: SchemaType.NUMBER },
                carbs: { type: SchemaType.NUMBER },
                fats: { type: SchemaType.NUMBER }
              }
            },
            meals: {
              type: SchemaType.OBJECT,
              properties: {
                breakfast: { type: SchemaType.OBJECT, properties: { name: { type: SchemaType.STRING }, calories: { type: SchemaType.NUMBER }, protein: { type: SchemaType.NUMBER }, carbs: { type: SchemaType.NUMBER }, fats: { type: SchemaType.NUMBER }, description: { type: SchemaType.STRING } } },
                lunch: { type: SchemaType.OBJECT, properties: { name: { type: SchemaType.STRING }, calories: { type: SchemaType.NUMBER }, protein: { type: SchemaType.NUMBER }, carbs: { type: SchemaType.NUMBER }, fats: { type: SchemaType.NUMBER }, description: { type: SchemaType.STRING } } },
                snack: { type: SchemaType.OBJECT, properties: { name: { type: SchemaType.STRING }, calories: { type: SchemaType.NUMBER }, protein: { type: SchemaType.NUMBER }, carbs: { type: SchemaType.NUMBER }, fats: { type: SchemaType.NUMBER }, description: { type: SchemaType.STRING } } },
                dinner: { type: SchemaType.OBJECT, properties: { name: { type: SchemaType.STRING }, calories: { type: SchemaType.NUMBER }, protein: { type: SchemaType.NUMBER }, carbs: { type: SchemaType.NUMBER }, fats: { type: SchemaType.NUMBER }, description: { type: SchemaType.STRING } } }
              }
            }
          }
        }
      }
    });

    const text = response.text();
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("ERROR GENERANDO DIETA:", error);
    throw error;
  }
};

export const chatWithNutriBot = async (message: string, profile: UserProfile) => {
  try {
    const context = `Eres NutriBot. Usuario: ${profile.weight}kg, Meta: ${profile.goal}. Responde breve y motivador.`;
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `System: ${context}\nUser: ${message}`
    });
    
    return response.text() || "No pude procesar eso.";
  } catch (error) {
    console.error("ERROR CHAT:", error);
    return "Error de conexión con NutriBot.";
  }
};

export const analyzeFoodImage = async (base64Image: string): Promise<FoodAnalysis> => {
  try {
    const imagePart = { inlineData: { mimeType: 'image/jpeg', data: base64Image } };
    const prompt = "Analiza esta comida. JSON: dishName, estimatedCalories, macros (protein, carbs, fats), ingredients (lista).";

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { role: "user", parts: [imagePart, { text: prompt }] },
      config: { responseMimeType: "application/json" }
    });

    const text = response.text();
    return JSON.parse(text);
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
    return response.text();
  } catch (error) {
    return "Error generando lista.";
  }
};
