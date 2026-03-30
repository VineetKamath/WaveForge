import { Portfolio, Service, Strategy } from './data';

export interface AnalysisResult {
  portfolio: Portfolio;
  waves: number;
  violations: { sourceId: string; targetId: string }[];
}

export function analyzePortfolio(portfolio: Portfolio): AnalysisResult {
  const services = [...portfolio.services];
  
  // 1. Calculate dependents
  services.forEach(s => {
    s.dependents = services.filter(other => other.dependencies.includes(s.id)).map(other => other.id);
  });

  // 2. Calculate Risk Score
  services.forEach(s => {
    let score = 0;
    switch (s.criticality) {
      case 'Critical': score += 60; break;
      case 'High': score += 40; break;
      case 'Medium': score += 20; break;
      case 'Low': score += 10; break;
    }
    score += (s.dependents?.length || 0) * 5;
    if (s.uptime < 95) score += 20;
    else if (s.uptime < 99) score += 10;
    else if (s.uptime < 99.9) score += 5;
    
    s.riskScore = Math.min(100, score);
  });

  // 3. Determine Strategy (Simple rule-based for mock)
  services.forEach(s => {
    if (s.type === 'Database') s.strategy = 'Replatform';
    else if (s.type === 'Legacy App' || s.type === 'Application') s.strategy = 'Refactor';
    else if (s.type === 'API' || s.type === 'Microservice' || s.type === 'Backend') s.strategy = 'Rehost';
    else if (s.type === 'Frontend' || s.type === 'Media') s.strategy = 'Replatform';
    else s.strategy = 'Retain';
  });

  // 4. Wave Planning (Topological Sort)
  let currentWave = 1;
  let remaining = [...services];
  
  // Reset waves
  services.forEach(s => s.wave = undefined);

  while (remaining.length > 0) {
    // Find services whose dependencies are already assigned to PREVIOUS waves
    const ready = remaining.filter(s => {
      // If no dependencies, it's ready
      if (s.dependencies.length === 0) return true;
      
      // Check if all dependencies are in a wave strictly less than currentWave
      return s.dependencies.every(depId => {
        const depService = services.find(x => x.id === depId);
        return depService && depService.wave !== undefined && depService.wave < currentWave;
      });
    });

    if (ready.length === 0) {
      // Cycle detected or unresolvable dependencies. Break cycle arbitrarily.
      console.warn("Cycle detected or unresolvable dependencies in wave planning.");
      // Just take the first remaining one and force it into the current wave
      ready.push(remaining[0]);
    }

    ready.forEach(s => {
      const actualService = services.find(x => x.id === s.id)!;
      actualService.wave = currentWave;
    });

    remaining = remaining.filter(s => !ready.find(r => r.id === s.id));
    currentWave++;
  }

  const maxWave = Math.max(...services.map(s => s.wave || 1));

  return {
    portfolio: { ...portfolio, services },
    waves: maxWave,
    violations: checkViolations(services)
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
