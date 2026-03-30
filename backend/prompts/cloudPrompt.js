export function cloudPrompt(service) {
  return `Recommend a cloud provider for this service.
Service: ${JSON.stringify(service)}

Return JSON matching this schema:
{
  "serviceId": "${service.id}",
  "recommendedProvider": "AWS", // or "Azure" or "GCP"
  "explanation": "A 2-3 sentence explanation of why this provider is the best fit.",
  "comparisons": {
    "AWS": { "pros": ["Pro 1", "Pro 2"], "cons": ["Con 1", "Con 2"] },
    "Azure": { "pros": ["Pro 1", "Pro 2"], "cons": ["Con 1", "Con 2"] },
    "GCP": { "pros": ["Pro 1", "Pro 2"], "cons": ["Con 1", "Con 2"] }
  }
}`;
}
