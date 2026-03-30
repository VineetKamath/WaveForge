import { GoogleGenAI } from '@google/genai';
import { explanationPrompt } from '../prompts/explanationPrompt.js';
import { cloudPrompt } from '../prompts/cloudPrompt.js';
import { migrationPrompt } from '../prompts/migrationPrompt.js';
import { getDeterministicCloudRecommendation } from '../services/cloudAdvisor.js';
import { getDeterministicMigrationSteps } from '../services/migrationGuide.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy' });

export async function getExplanation(portfolio, waves, riskScores, strategies) {
  if (!process.env.GEMINI_API_KEY) {
    return getFallbackExplanation(portfolio, waves);
  }

  try {
    const prompt = explanationPrompt(portfolio, waves, riskScores, strategies);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Explanation Error:", error);
    return getFallbackExplanation(portfolio, waves);
  }
}

export async function getCloudRecommendation(service) {
  if (!process.env.GEMINI_API_KEY) {
    return getDeterministicCloudRecommendation(service);
  }

  try {
    const prompt = cloudPrompt(service);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Cloud Recommendation Error:", error);
    return getDeterministicCloudRecommendation(service);
  }
}

export async function getMigrationSteps(service, provider) {
  if (!process.env.GEMINI_API_KEY) {
    return getDeterministicMigrationSteps(service, provider);
  }

  try {
    const prompt = migrationPrompt(service, provider);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Migration Steps Error:", error);
    return getDeterministicMigrationSteps(service, provider);
  }
}

function getFallbackExplanation(portfolio, waves) {
  return {
    executiveSummary: "This is a deterministic fallback summary. The portfolio contains " + portfolio.services.length + " services.",
    keyRisks: ["Legacy Systems", "High Dependencies"],
    waveRationale: waves.map(w => ({
      wave: w.id,
      rationale: "Assigned based on deterministic scoring rules."
    })),
    recommendedActions: ["Review critical services", "Plan downtime"],
    confidenceScore: 85,
    estimatedDuration: "12 weeks"
  };
}
