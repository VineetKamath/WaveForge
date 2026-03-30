import { GoogleGenAI } from '@google/genai';
import { Portfolio } from './data';

export interface AIInsights {
  executiveSummary: string;
  keyRisks: string[];
  waveRationale: { wave: number; rationale: string }[];
  recommendedActions: string[];
  confidenceScore: number;
  estimatedDuration: string;
}

export async function generateAIInsights(portfolio: Portfolio): Promise<AIInsights> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Analyze the following cloud migration portfolio and provide insights.
Portfolio: ${portfolio.name} (${portfolio.sector})
Services: ${JSON.stringify(portfolio.services.map(s => ({ name: s.name, type: s.type, criticality: s.criticality, dependencies: s.dependencies, wave: s.wave, strategy: s.strategy })))}

Return a JSON object with the following structure:
{
  "executiveSummary": "A 2-3 sentence summary of the migration plan.",
  "keyRisks": ["Risk 1", "Risk 2", "Risk 3"],
  "waveRationale": [
    { "wave": 1, "rationale": "Why these services are in wave 1" },
    { "wave": 2, "rationale": "Why these services are in wave 2" }
  ],
  "recommendedActions": ["Action 1", "Action 2", "Action 3"],
  "confidenceScore": 85, // A number between 0 and 100
  "estimatedDuration": "6-8 months"
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    if (!response.text) {
      throw new Error("No response from AI.");
    }

    return JSON.parse(response.text) as AIInsights;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate AI insights. Please try again.");
  }
}
