export function explanationPrompt(portfolio, waves, riskScores, strategies) {
  return `Analyze this cloud migration portfolio and provide insights.
Portfolio: ${JSON.stringify(portfolio)}
Waves: ${JSON.stringify(waves)}
Risk Scores: ${JSON.stringify(riskScores)}
Strategies: ${JSON.stringify(strategies)}

Return JSON matching this schema:
{
  "executiveSummary": "string",
  "keyRisks": ["string"],
  "waveRationale": [
    { "wave": number, "rationale": "string" }
  ],
  "recommendedActions": ["string"],
  "confidenceScore": number (0-100),
  "estimatedDuration": "string"
}`;
}
