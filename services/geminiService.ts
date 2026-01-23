// @ts-nocheck
/* MODO EXAMEN: DATOS SIMULADOS */

// No importamos nada para evitar errores de compilación

const MOCK_DIET = {
  dailyCalories: 2100,
  macros: { protein: 160, carbs: 220, fats: 70 },
  meals: {
    breakfast: { 
      name: "Tortitas de Avena", 
      calories: 450, 
      protein: 20, carbs: 60, fats: 10, 
      description: "Tortitas con claras y plátano." 
    },
    lunch: { 
      name: "Pollo con Arroz", 
      calories: 700, 
      protein: 50, carbs: 80, fats: 15, 
      description: "Pechuga de pollo a la plancha con arroz." 
    },
    snack: { 
      name: "Yogur y Nueces", 
      calories: 300, 
      protein: 15, carbs: 20, fats: 15, 
      description: "Yogur griego con almendras." 
    },
    dinner: { 
      name: "Merluza con Verduras", 
      calories: 650, 
      protein: 40, carbs: 30, fats: 25, 
      description: "Pescado blanco al horno." 
    }
  }
};

const MOCK_FOOD = {
  dishName: "Plato Saludable (Detectado)",
  estimatedCalories: 520,
  macros: { protein: 35, carbs: 45, fats: 20 },
  ingredients: ["Pollo", "Arroz", "Verduras"]
};

// Funciones falsas que devuelven los datos de arriba
export const generateDietPlan = async (profile) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return MOCK_DIET;
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
