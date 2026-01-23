// @ts-nocheck

/* MODO EMERGENCIA: SIN LIBRERÍAS EXTERNAS.
  Este código simula que la IA funciona devolviendo datos fijos.
  Esto garantiza que la web CARGUE y FUNCIONE para la presentación.
*/

// --- DATOS FIJOS PARA QUE SE VEA BONITO ---
const DIETA_EJEMPLO = {
  dailyCalories: 2150,
  macros: { protein: 160, carbs: 220, fats: 70 },
  meals: {
    breakfast: { 
      name: "Tortitas de Avena y Plátano", 
      calories: 450, 
      protein: 20, 
      carbs: 60, 
      fats: 10, 
      description: "Deliciosas tortitas con claras de huevo, avena y rodajas de fruta fresca." 
    },
    lunch: { 
      name: "Bowl de Pollo y Quinoa", 
      calories: 700, 
      protein: 45, 
      carbs: 75, 
      fats: 20, 
      description: "Pechuga de pollo a la plancha con base de quinoa, aguacate y tomate." 
    },
    snack: { 
      name: "Yogur Griego con Nueces", 
      calories: 300, 
      protein: 15, 
      carbs: 20, 
      fats: 15, 
      description: "Yogur natural cremoso con un puñado de frutos secos." 
    },
    dinner: { 
      name: "Salmón al Horno con Verduras", 
      calories: 700, 
      protein: 40, 
      carbs: 45, 
      fats: 25, 
      description: "Lomo de salmón horneado con espárragos y patata asada." 
    }
  }
};

const ANALISIS_COMIDA_EJEMPLO = {
  dishName: "Plato Saludable Detectado",
  estimatedCalories: 520,
  macros: { protein: 35, carbs: 40, fats: 20 },
  ingredients: ["Proteína magra", "Verduras variadas", "Carbohidrato complejo", "Grasas saludables"]
};

// --- FUNCIONES QUE SOLO DEVUELVEN LOS DATOS (SIN CONECTAR A NADA) ---

export const generateDietPlan = async (profile) => {
  console.log("Generando dieta simulada para...", profile);
  // Esperamos 1 segundo para que parezca que "piensa"
  await new Promise(resolve => setTimeout(resolve, 1000));
  return DIETA_EJEMPLO;
};

export const analyzeFoodImage = async (base64Image) => {
  console.log("Analizando imagen simulada...");
  // Esperamos 1.5 segundos
  await new Promise(resolve => setTimeout(resolve, 1500));
  return ANALISIS_COMIDA_EJEMPLO;
};

export const chatWithNutriBot = async (message, profile) => {
  // Respuestas automáticas simples para que el chat no se quede mudo
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (message.toLowerCase().includes("hola")) {
    return "¡Hola! Soy NutriBot. Veo que quieres mejorar tu alimentación. ¿En qué puedo ayudarte hoy?";
  }
  return "¡Es una excelente pregunta! Basado en tu perfil, te recomiendo mantener la constancia, beber 2 litros de agua y seguir el plan de comidas. ¡Tú puedes!";
};

export const generateShoppingList = async (dietPlan) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return "Pechuga de pollo, Quinoa, Avena, Huevos, Plátanos, Nueces, Salmón, Espárragos, Yogur Griego.";
};
