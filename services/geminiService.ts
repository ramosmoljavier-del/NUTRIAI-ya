import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, DietPlan, FoodAnalysis } from "../types";

// ⚠️ TU CLAVE API
const ai = new GoogleGenAI({ apiKey: "AIzaSyCzNudeombMbkCSc2an6iL8GiU-GSckMwg" });

// USAMOS EL MODELO 1.5 FLASH (El más rápido y estable)
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
          type: Type.OBJECT,
          properties: {
            dailyCalories: { type: Type.NUMBER },
            macros: {
              type: Type.OBJECT,
              properties: {
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fats: { type: Type.NUMBER }
              }
            },
            meals: {
              type: Type.OBJECT,
              properties: {
                breakfast: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, calories: { type: Type.NUMBER }, protein: { type: Type.NUMBER }, carbs: { type: Type.NUMBER }, fats: { type: Type.NUMBER }, description: { type: Type.STRING } } },
                lunch: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, calories: { type: Type.NUMBER }, protein: { type: Type.NUMBER }, carbs: { type: Type.NUMBER }, fats: { type: Type.NUMBER }, description: { type: Type.STRING } } },
                snack: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, calories: { type: Type.NUMBER }, protein: { type: Type.NUMBER }, carbs: { type: Type.NUMBER }, fats: { type: Type.NUMBER }, description: { type: Type.STRING } } },
                dinner: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, calories: { type: Type.NUMBER }, protein: { type: Type.NUMBER }, carbs: { type: Type.NUMBER }, fats: { type: Type.NUMBER }, description: { type: Type.STRING } } }
              }
            }
          }
        }
      }
    });

    // CORRECCIÓN AQUÍ: Usamos .text como propiedad, no función
    const text = response.text; 
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
    
    const chat = ai.chats.create({
      model: MODEL_NAME,
      config: { systemInstruction: context }
    });
    
    const response = await chat.sendMessage({ part: { text: message } });
    return response.text || "No pude procesar eso.";
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
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dishName: { type: Type.STRING },
            estimatedCalories: { type: Type.NUMBER },
            macros: { type: Type.OBJECT, properties: { protein: { type: Type.NUMBER }, carbs: { type: Type.NUMBER }, fats: { type: Type.NUMBER } } },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidence: { type: Type.NUMBER }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
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
    return response.text || "Error generando lista.";
  } catch (error) {
    return "Error generando lista.";
  }
};
  }
};
