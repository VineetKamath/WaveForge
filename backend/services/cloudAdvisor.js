export function getDeterministicCloudRecommendation(service) {
  let awsScore = 0;
  let azureScore = 0;
  let gcpScore = 0;

  if (service.type.toLowerCase().includes('legacy')) {
    awsScore += 2;
    azureScore += 3;
  } else {
    gcpScore += 2;
    awsScore += 1;
  }
  if (service.criticality === 'critical') {
    awsScore += 2;
    azureScore += 2;
  }

  let winner = 'AWS';
  if (azureScore > awsScore && azureScore > gcpScore) winner = 'Azure';
  if (gcpScore > awsScore && gcpScore > azureScore) winner = 'GCP';

  return {
    serviceId: service.id,
    recommendedProvider: winner,
    explanation: `Based on the service type (${service.type}) and criticality (${service.criticality}), ${winner} is recommended.`,
    comparisons: {
      AWS: { pros: ["Strong ecosystem", "High reliability"], cons: ["Complex pricing", "Steep learning curve"] },
      Azure: { pros: ["Excellent enterprise integration", "Strong hybrid cloud"], cons: ["Can be complex to manage", "Support can be slow"] },
      GCP: { pros: ["Best for modern apps", "Great data analytics"], cons: ["Fewer enterprise features", "Smaller market share"] }
    }
  };
}
