export function calculateRiskScore(service, depCount) {
  const isLegacy = service.type.toLowerCase().includes('legacy') ? 1 : 0;
  let critScore = 1;
  switch (service.criticality) {
    case 'critical': critScore = 4; break;
    case 'high': critScore = 3; break;
    case 'medium': critScore = 2; break;
    case 'low': critScore = 1; break;
  }
  const uptimeContribution = Math.max(0, (service.uptimeSLA - 97) * 0.50);
  const score = (depCount * 0.30) + (isLegacy * 3.00) + (critScore * 2.50) + uptimeContribution;
  return Number(score.toFixed(2));
}
