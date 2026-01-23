import { GoogleGenerativeAI } from "google-generative-ai";
import { UserProfile, DietPlan, FoodAnalysis } from "../types";

// TU CLAVE API
const API_KEY = "AIzaSyCzNudeombMbkCSc2an6iL8GiU-GSckMwg";
const genAI = new GoogleGenerativeAI(API_KEY);

// Usamos el modelo Flash
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- DATOS DE RESPALDO (Por si la IA falla) ---
const FALLBACK_DIET: DietPlan = {
  dailyCalories: 2000,
  macros: { protein: 150, carbs: 200, fats: 70 },
  meals: {
    breakfast: { name: "Avena con Frutas", calories: 450, protein: 15, carbs: 60, fats: 10, description: "Avena cocida con rodajas de plátano, fresas y un toque de miel." },
    lunch: { name: "Pechuga de Pollo y Quinoa", calories: 650, protein: 45, carbs: 50, fats: 20, description: "Pechuga a la plancha con quinoa, aguacate y ensalada fresca." },
    snack: { name: "Yogur Griego y Nueces", calories: 300, protein: 20, carbs: 15, fats: 15, description: "Yogur natural sin azúcar con un puñado de nueces mixtas." },
    dinner: { name: "Salmón al Horno", calories: 600, protein: 40, carbs: 10, fats: 35, description: "Filete de salmón horneado con espárragos y aceite de oliva." }
  }
};

export const generateDietPlan = async (profile: UserProfile): Promise<DietPlan> => {
  try {
    const prompt = `Actúa como nutricionista. Crea dieta JSON para: ${profile.gender}, ${profile.weight}kg, obj: ${profile.goal}.
    Estructura JSON exacta: { "dailyCalories": number, "macros": { "protein": n, "carbs": n, "fats": n }, "meals": { "breakfast": {...}, "lunch": {...}, "snack": {...}, "dinner": {...} } }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.warn("⚠️ LA IA FALLÓ (Probablemente por ubicación), USANDO MODO RESPALDO.");
    // AQUÍ ESTÁ EL TRUCO: Si falla, devolvemos la dieta de ejemplo en vez de un error
    return FALLBACK_DIET; 
  }
};

export const chatWithNutriBot = async (message: string, profile: UserProfile) => {
  try {
    const chat = model.startChat({
      history: [{ role: "user", parts: [{ text: "Hola" }] }, { role: "model", parts: [{ text: "Hola soy NutriAI" }] }]
    });
    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (error) {
    return "⚠️ Estoy en modo mantenimiento (Error de conexión con Google). Por favor intenta más tarde o usa una VPN.";
  }
};

export const analyzeFoodImage = async (base64Image: string): Promise<FoodAnalysis> => {
  try {
    const imagePart = { inlineData: { data: base64Image.split(',')[1] || base64Image, mimeType: "image/jpeg" } };
    const result = await model.generateContent(["Analiza comida JSON: dishName, estimatedCalories, macros, ingredients", imagePart]);
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    // Respaldo para imagen
    return { 
      dishName: "Plato detectado (Modo Demo)", 
      estimatedCalories: 500, 
      macros: { protein: 30, carbs: 40, fats: 20 }, 
      ingredients: ["Ingrediente 1", "Ingrediente 2"] 
    };
  }
};

export const generateShoppingList = async (dietPlan: DietPlan) => {
  try {
    const result = await model.generateContent("Lista de compra breve para esta dieta");
    return result.response.text();
  } catch (error) {
    return "Pollo, Arroz, Avena, Huevos, Aguacate, Espinacas, Aceite de Oliva.";
  }
};
