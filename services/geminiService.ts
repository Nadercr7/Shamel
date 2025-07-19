
import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAi = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const summarizeText = async (text: string, lang: 'en' | 'ar'): Promise<string> => {
  try {
    const genAI = getAi();
    const languageInstruction = lang === 'ar' ? 'in Arabic' : 'in English';
    const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Summarize the following text for a student ${languageInstruction}. Focus on the key points and make it easy to understand. Keep it concise, under 200 words.\n\nText: "${text}"`,
    });
    return response.text;
  } catch (error) {
    console.error("Error summarizing text:", error);
    throw new Error("Failed to communicate with the AI summarization service.");
  }
};
