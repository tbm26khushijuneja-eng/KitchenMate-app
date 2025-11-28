import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Recipe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRecipes = async (profile: UserProfile): Promise<Recipe[]> => {
  const modelId = "gemini-2.5-flash";

  // Extract high rated dishes for context
  const favorites = profile.ratings
    .filter(r => r.stars >= 4)
    .map(r => r.dishName)
    .join(', ');

  const prompt = `
    You are a helpful, friendly cooking companion app called KitchenMate.
    Suggest 3 to 5 distinct recipes based on the following user profile:
    
    - Ingredients available: ${profile.ingredients.join(', ')} (Assume basic staples like salt, oil, pepper are available)
    - Dietary Preference: ${profile.dietary}
    - Food Mood: ${profile.mood}
    - Meal Type: ${profile.mealType}
    - Difficulty: ${profile.difficulty}
    - Health Goals: ${profile.goals.join(', ')}
    - Cuisine Craving: ${profile.cuisine}
    ${favorites ? `- User previously loved these dishes: ${favorites}. Try to suggest something with a similar vibe if it fits the current criteria.` : ''}

    Rules:
    1. Do NOT refer to yourself as a chef. Be a friendly guide.
    2. Only suggest dishes that match the dietary preference strictly.
    3. Try to use the listed ingredients as the main components.
    4. Keep instructions concise.
    5. Provide a 'matchReason' explaining why this fits their specific mood and goals.
    6. Provide a simple, visual 'imageKeyword' (e.g. "Pepperoni Pizza", "Caesar Salad", "Tomato Soup") that can be used to search for a photo of this dish.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              cookingTimeMinutes: { type: Type.INTEGER },
              ingredients: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              steps: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              matchReason: { type: Type.STRING },
              imageKeyword: { type: Type.STRING, description: "A short, descriptive keyword for finding an image of this dish, e.g., 'Spaghetti Bolognese'" },
            },
            required: ["name", "description", "cookingTimeMinutes", "ingredients", "steps", "matchReason", "imageKeyword"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as Recipe[];
  } catch (error) {
    console.error("Error generating recipes:", error);
    return [];
  }
};