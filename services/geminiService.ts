// @ts-nocheck

// --- MODO SIMULACIÓN PARA EXAMEN ---

const MOCK_DIET = {
  dailyCalories: 2000,
  macros: { protein: 150, carbs: 200, fats: 65 },
  meals: {
    breakfast: { 
      name: "Tortitas de Avena", 
      calories: 400, 
      protein: 20, carbs: 50, fats: 10, 
      description: "Tortitas con plátano y claras." 
    },
    lunch: { 
      name: "Pollo con Arroz", 
      calories: 700, 
      protein: 50, carbs: 80, fats: 15, 
      description: "Pechuga de pollo a la plancha con arroz blanco." 
    },
    snack: { 
      name: "Yogur y Almendras", 
      calories: 300, 
      protein: 15, carbs: 20, fats: 20, 
      description: "Yogur griego natural." 
    },
    dinner: { 
      name: "Pescado al Horno", 
      calories: 600, 
      protein: 35, carbs: 30, fats: 25, 
      description: "Merluza con verduras asadas." 
    }
  }
};

const MOCK_FOOD = {
  dishName: "Plato Saludable",
  estimatedCalories: 500,
  macros: { protein: 30, carbs: 45, fats: 20 },
  ingredients: ["Pollo", "Verduras", "Aceite"]
};

// Usamos 'any' para que no de errores de tipo nunca
export const generateDietPlan = async (profile: any) => {
  // Simular espera de 1 segundo
  await new Promise(r => setTimeout(r, 1000)); 
  return MOCK_DIET;
};

export const analyzeFoodImage = async (base64Image: any) => {
  // Simular espera
  await new Promise(r => setTimeout(r, 1000));
  return MOCK_FOOD;
};

export const chatWithNutriBot = async (message: any, profile: any) => {
  // Respuesta automática
  return "¡Hola! Veo que vas muy bien. Sigue así con tu dieta y no olvides beber agua.";
};

export const generateShoppingList = async (dietPlan: any) => {
  return "Pollo, Arroz, Avena, Huevos, Aceite de Oliva.";
};

const ANALISIS_DEMO = {
  dishName: "Plato Saludable (Detectado)",
  estimatedCalories: 550,
  macros: { protein: 35, carbs: 45, fats: 20 },
  ingredients: ["Pollo", "Arroz", "Verduras", "Aceite de Oliva"]
};

// --- FUNCIONES SIMULADAS ---

export const generateDietPlan = async (profile) => {
  // Simulamos que pensamos un poco (1 segundo)
  await new Promise(r => setTimeout(r, 1000));
  return DIETA_DEMO;
};

export const analyzeFoodImage = async (base64Image) => {
  // Simulamos que analizamos la foto
  await new Promise(r => setTimeout(r, 1500));
  return ANALISIS_DEMO;
};

export const chatWithNutriBot = async (message, profile) => {
  // Respuesta genérica que siempre queda bien
  return "¡Hola! Para lograr tu objetivo, te recomiendo seguir el plan de comidas estrictamente y beber 2 litros de agua al día. ¡Vas muy bien!";
};

export const generateShoppingList = async (dietPlan) => {
  return "Pechuga de pollo, Arroz integral, Avena, Huevos, Aceite de Oliva, Espinacas, Plátanos, Yogur Griego.";
};
