
"use server";

import { suggestCustomizations, type SuggestCustomizationsInput, type SuggestCustomizationsOutput } from '@/ai/flows/suggest-customizations';

export async function getAiSuggestions(
  vehicleModel: string,
  userPreferences: string
): Promise<SuggestCustomizationsOutput> {
  try {
    const input: SuggestCustomizationsInput = {
      vehicleModel,
      userPreferences,
    };
    const suggestions = await suggestCustomizations(input);
    return suggestions;
  } catch (error) {
    console.error("Error getting AI suggestions:", error);
    // In a real app, you might want to log this to a monitoring service
    throw new Error("Failed to get suggestions from AI. Please try again later.");
  }
}
