// @ts-nocheck
import { GoogleGenAI } from "@google/genai";

// ⚠️ TU CLAVE PUESTA A FUEGO (Esto no puede fallar)
const apiKey = "AIzaSyCzNudeombMbkCSc2an6iL8GiU-GSckMwg";
const ai = new GoogleGenAI({ apiKey: apiKey });

// USAMOS EL MODELO RÁPIDO Y ESTABLE
const MODEL_NAME = 'gemini-1.5-flash';

console.log("✅ SISTEMA DE IA INICIADO CON MODELO:", MODEL_NAME);

export const generateDietPlan = async (profile) => {
  try {
    const prompt = `Actúa como Nutricionista. Calcula con Mifflin-St Jeor:
    - Usuario: ${profile.gender}, ${profile.age} años, ${profile.weight}kg, ${profile.height}cm.
    - Objetivo: ${profile.goal}.
    - Dieta: ${profile.dietType}.
    
    Genera un plan diario JSON válido con: dailyCalories, macros (protein, carbs, fats), y meals (breakfast, lunch, snack, dinner).`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    // Extracción de texto a prueba de fallos
    let text = "";
    if (response.text && typeof response.text === 'function') {
        text = response.text(); 
    } else if (response.text) {
        text = response.text;
    } else {
        text = JSON.stringify(response);
    }

    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);

  } catch (error) {
    console.error("❌ ERROR CRÍTICO EN DIETA:", error);
    // Devolvemos una dieta de emergencia para que la app no explote
    return {
      dailyCalories: 2000,
      macros: { protein: 150, carbs: 200, fats: 60 },
      meals: {
        breakfast: { name: "Error de conexión", calories: 0, protein: 0, carbs: 0, fats: 0, description: "Inténtalo de nuevo." },
        lunch: { name: "Error de conexión", calories: 0, protein: 0, carbs: 0, fats: 0, description: "Inténtalo de nuevo." },
        snack: { name: "Error de conexión", calories: 0, protein: 0, carbs: 0, fats: 0, description: "Inténtalo de nuevo." },
        dinner: { name: "Error de conexión", calories: 0, protein: 0, carbs: 0, fats: 0, description: "Inténtalo de nuevo." }
      }
    };
  }
};

export const chatWithNutriBot = async (message, profile) => {
  try {
    const context = `Eres NutriBot. Usuario: ${profile.weight}kg, Meta: ${profile.goal}. Responde breve y motivador en español.`;
    
    const chat = ai.chats.create({
      model: MODEL_NAME,
      config: { systemInstruction: context }
    });
    
    const response = await chat.sendMessage({ part: { text: message } });
    
    let text = "";
    if (response.text && typeof response.text === 'function') {
        text = response.text();
    } else if (response.text) {
        text = response.text;
    }
    
    return text || "No pude procesar tu mensaje.";
  } catch (error) {
    console.error("❌ ERROR CHAT:", error);
    return "Lo siento, tengo un problema de conexión. Inténtalo en un momento.";
  }
};

export const analyzeFoodImage = async (base64Image) => {
  try {
    const imagePart = { inlineData: { mimeType: 'image/jpeg', data: base64Image } };
    const prompt = "Analiza esta comida. Responde SOLO en JSON con: dishName, estimatedCalories, macros (protein, carbs, fats), ingredients (array strings).";

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { role: "user", parts: [imagePart, { text: prompt }] },
      config: { responseMimeType: "application/json" }
    });

    let text = "";
    if (response.text && typeof response.text === 'function') {
        text = response.text();
    } else if (response.text) {
        text = response.text;
    }

    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("❌ ERROR VISIÓN:", error);
    throw error;
  }
};

export const generateShoppingList = async (dietPlan) => {
  return "Lista de compra generada.";
};
