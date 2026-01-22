import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, DietPlan, FoodAnalysis } from "../types";

// ⚠️ AQUÍ ESTÁ TU CLAVE PUESTA DIRECTAMENTE
const ai = new GoogleGenAI({ apiKey: "AIzaSyCzNudeombMbkCSc2an6iL8GiU-GSckMwg" });

export const generateDietPlan = async (profile: UserProfile): Promise<DietPlan> => {
  const activityFactors: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  const factor = activityFactors[profile.activityLevel] || 1.2;

  const prompt = `Actúa como un Nutricionista Clínico de Élite. 
  CALCULA con precisión matemática usando la fórmula de Mifflin-St Jeor:
  - Usuario: ${profile.gender === 'male' ? 'Hombre' : 'Mujer'}, ${profile.age} años, ${profile.weight}kg, ${profile.height}cm.
  - Actividad Física: Factor ${factor} (${profile.activityLevel}).
  - Objetivo: ${profile.goal} (Aplica un ${profile.goal === 'lose' ? 'déficit del 20%' : profile.goal === 'gain' ? 'superávit del 15%' : 'mantenimiento'}).
  - Estilo de Dieta: ${profile.dietType}.
  - Preferencias: ${profile.favoriteFoods.proteins.join(', ')}.

  REGLAS ESTRICTAS:
  1. El total de calorías DEBE ser el resultado del cálculo termodinámico real.
  2. Los macros DEBEN sumar el total de calorías (P*4 + C*4 + G*9 = Total).
  3. Responde exclusivamente en JSON con esta estructura:
  {
    "dailyCalories": número,
    "macros": { "protein": número, "carbs": número, "fats": número },
    "meals": {
      "breakfast": { "name": "Nombre", "calories": número, "protein": número, "carbs": número, "fats": número, "description": "Detalles" },
      "lunch": { "name": "Nombre", "calories": número, "protein": número, "carbs": número, "fats": número, "description": "Detalles" },
      "snack": { "name": "Nombre", "calories": número, "protein": número, "carbs": número, "fats": número, "description": "Detalles" },
      "dinner": { "name": "Nombre", "calories": número, "protein": número, "carbs": número, "fats": número, "description": "Detalles" }
    }
  }`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash', 
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

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text.trim());
};

export const analyzeFoodImage = async (base64Image: string): Promise<FoodAnalysis> => {
  const imagePart = { inlineData: { mimeType: 'image/jpeg', data: base64Image } };
  const textPart = { text: "Analiza esta comida. Sé extremadamente realista con las porciones. Si ves aceite o salsas, inclúyelo en el cálculo. Estima el gramaje de cada ingrediente antes de dar el total. Responde en español y en formato JSON." };

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: { role: "user", parts: [imagePart, textPart] },
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
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text.trim());
};

export const chatWithNutriBot = async (message: string, profile: UserProfile) => {
  const context = `Eres NutriBot, el asistente de NutriAI.
  DATOS REALES DEL USUARIO:
  - Biometría: ${profile.age} años, ${profile.weight}kg, ${profile.height}cm, Género: ${profile.gender === 'male' ? 'Hombre' : 'Mujer'}.
  - Objetivo: ${profile.goal === 'lose' ? 'Perder grasa' : profile.goal === 'gain' ? 'Ganar músculo' : 'Mantenimiento'}.
  - Nivel de Actividad: ${profile.activityLevel}.
  - Dieta: ${profile.dietType}.
  
  Tu misión es dar consejos basados en estos datos. Si te preguntan cuántas calorías deben comer, calcula su TMB (Tasa Metabólica Basal) y diles la cifra exacta de mantenimiento o déficit/superávit según su meta. 
  Responde SIEMPRE en español, de forma técnica pero motivadora.`;

  const chat = ai.chats.create({
    model: 'gemini-2.0-flash',
    config: {
      systemInstruction: context,
    }
  });
  
  const response = await chat.sendMessage({ part: { text: message } });
  return response.text || "Lo siento, no pude procesar eso.";
};

export const generateShoppingList = async (dietPlan: DietPlan) => {
  const prompt = `Basado en este plan diario: ${JSON.stringify(dietPlan)}, genera una lista de la compra semanal (multiplica por 7 cantidades aproximadas). Responde en español de forma muy organizada.`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt
  });
  return response.text || "Error generando lista.";
};
