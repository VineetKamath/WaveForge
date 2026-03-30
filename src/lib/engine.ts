import { Portfolio, Service, Strategy } from './data';
import { AIInsights } from '../components/AIInsightsPanel';

export interface AnalysisResult {
  portfolio: Portfolio;
  waves: number;
  violations: { sourceId: string; targetId: string }[];
  aiInsights: AIInsights;
}

export async function analyzePortfolio(portfolio: Portfolio): Promise<any> {
  const mappedPortfolio = {
    ...portfolio,
    services: portfolio.services.map(s => ({
      id: s.id,
      name: s.name,
      type: s.type,
      criticality: s.criticality.toLowerCase(),
      dependencies: s.dependencies,
      uptimeSLA: s.uptime
    }))
  };

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ portfolio: mappedPortfolio })
  });
  
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to analyze portfolio');
  }
  
  const data = await response.json();
  
  // Map backend data back to frontend structure
  const services = portfolio.services.map(s => {
    return {
      ...s,
      riskScore: data.riskScores[s.id],
      strategy: data.strategies[s.id],
      wave: data.waves.find((w: any) => w.services.some((ws: any) => ws.id === s.id))?.id || 1,
      dependents: portfolio.services.filter(other => other.dependencies.includes(s.id)).map(other => other.id)
    };
  });

  const maxWave = Math.max(...services.map(s => s.wave), 1);

  return {
    portfolio: { ...portfolio, services },
    waves: maxWave,
    violations: checkViolations(services),
    aiInsights: data.aiInsights
  };
}

export function checkViolations(services: Service[]): { sourceId: string; targetId: string }[] {
  const violations: { sourceId: string; targetId: string }[] = [];
  services.forEach(s => {
    if (s.wave === undefined) return;
    s.dependencies.forEach(depId => {
      const depService = services.find(x => x.id === depId);
      // A service cannot be in a wave earlier than or equal to its dependencies
      if (depService && depService.wave !== undefined && s.wave! <= depService.wave) {
        violations.push({ sourceId: s.id, targetId: depId });
      }
    });
  });
  return violations;
}
