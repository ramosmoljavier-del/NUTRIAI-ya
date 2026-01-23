// @ts-nocheck
/* MODO OFFLINE - DATOS FIJOS */

const DIET_MOCK = {
  dailyCalories: 2000,
  macros: { protein: 150, carbs: 200, fats: 65 },
  meals: {
    breakfast: { name: "Tortitas de Avena", calories: 400, protein: 20, carbs: 50, fats: 10, description: "Tortitas con fruta." },
    lunch: { name: "Pollo y Arroz", calories: 700, protein: 50, carbs: 80, fats: 15, description: "Plato combinado saludable." },
    snack: { name: "Yogur y Frutos Secos", calories: 300, protein: 15, carbs: 20, fats: 20, description: "Snack rápido." },
    dinner: { name: "Pescado con Verduras", calories: 600, protein: 35, carbs: 30, fats: 25, description: "Cena ligera." }
  }
};

const FOOD_MOCK = {
  dishName: "Plato Detectado",
  estimatedCalories: 500,
  macros: { protein: 30, carbs: 45, fats: 20 },
  ingredients: ["Ingrediente 1", "Ingrediente 2", "Ingrediente 3"]
};

export const generateDietPlan = async (profile: any) => {
  await new Promise(r => setTimeout(r, 1000));
  return DIET_MOCK;
};

export const analyzeFoodImage = async (base64Image: string) => {
  await new Promise(r => setTimeout(r, 1500));
  return FOOD_MOCK;
};

export const chatWithNutriBot = async (message: string, profile: any) => {
  return "¡Hola! Sigue así con tu dieta.";
};

export const generateShoppingList = async (dietPlan: any) => {
  return "Pollo, Arroz, Huevos, Avena.";
};
