// @ts-nocheck
/* MODO SIMULACRO TOTAL */

const MOCK_DATA = {
  dailyCalories: 2000,
  macros: { protein: 150, carbs: 200, fats: 60 },
  meals: {
    breakfast: { name: "Avena con frutas", calories: 400, protein: 15, carbs: 60, fats: 10, description: "Desayuno equilibrado." },
    lunch: { name: "Pollo con arroz", calories: 700, protein: 50, carbs: 70, fats: 15, description: "Almuerzo alto en proteína." },
    snack: { name: "Frutos secos", calories: 200, protein: 5, carbs: 10, fats: 15, description: "Snack saludable." },
    dinner: { name: "Ensalada completa", calories: 700, protein: 30, carbs: 50, fats: 20, description: "Cena ligera." }
  }
};

export const generateDietPlan = async () => {
  return MOCK_DATA;
};

export const analyzeFoodImage = async () => {
  return {
    dishName: "Plato detectado",
    estimatedCalories: 500,
    macros: { protein: 30, carbs: 40, fats: 20 },
    ingredients: ["Ingrediente 1", "Ingrediente 2"]
  };
};

export const chatWithNutriBot = async () => {
  return "¡Hola! Todo va según el plan. ¿En qué más te ayudo?";
};

export const generateShoppingList = async () => {
  return "Pollo, Arroz, Avena, Verduras.";
};
export const analyzeFoodImage = async (base64Image) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return MOCK_FOOD;
};

export const chatWithNutriBot = async (message, profile) => {
  return "¡Hola! Sigue así, lo estás haciendo genial.";
};

export const generateShoppingList = async (dietPlan) => {
  return "Pollo, Arroz, Huevos, Avena, Aceite.";
};
