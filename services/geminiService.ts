// @ts-nocheck

// --- DATOS FALSOS PARA LA PRESENTACIÓN ---
const DIETA_DEMO = {
  dailyCalories: 2200,
  macros: { protein: 160, carbs: 220, fats: 70 },
  meals: {
    breakfast: { 
      name: "Tortitas de Avena", 
      calories: 450, 
      protein: 20, carbs: 60, fats: 10, 
      description: "Tortitas con claras de huevo y plátano." 
    },
    lunch: { 
      name: "Pollo a la Plancha", 
      calories: 700, 
      protein: 50, carbs: 70, fats: 20, 
      description: "Pechuga de pollo con arroz integral y verduras." 
    },
    snack: { 
      name: "Yogur y Nueces", 
      calories: 350, 
      protein: 15, carbs: 20, fats: 20, 
      description: "Yogur griego natural con almendras." 
    },
    dinner: { 
      name: "Merluza al Horno", 
      calories: 700, 
      protein: 40, carbs: 40, fats: 25, 
      description: "Pescado blanco con patatas al vapor." 
    }
  }
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
