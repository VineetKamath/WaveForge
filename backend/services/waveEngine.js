import { detectCycle, topologicalSort } from './graphValidator.js';
import { calculateRiskScore } from './riskScorer.js';
import { getExplanation } from '../utils/claude.js';

export async function analyzePortfolio(portfolio) {
  if (!portfolio.services || portfolio.services.length === 0) {
    return {
      portfolio,
      waves: [],
      riskScores: {},
      strategies: {},
      aiInsights: {
        executiveSummary: "Empty portfolio provided.",
        keyRisks: [],
        recommendedActions: [],
        waveRationale: [],
        confidenceScore: 100,
        estimatedDuration: "0 weeks"
      }
    };
  }

  // Cycle detection
  const cycle = detectCycle(portfolio.services);
  if (cycle) {
    const err = new Error(`Circular dependency detected: ${cycle.join(' -> ')}`);
    err.code = 'CYCLE_DETECTED';
    err.details = cycle;
    throw err;
  }

  const sortedIds = topologicalSort(portfolio.services);
  const serviceMap = new Map(portfolio.services.map(s => [s.id, s]));
  
  // Calculate dependents
  const dependentsMap = new Map();
  for (const s of portfolio.services) {
    dependentsMap.set(s.id, []);
  }
  for (const s of portfolio.services) {
    for (const dep of s.dependencies) {
      if (dependentsMap.has(dep)) {
        dependentsMap.get(dep).push(s.id);
      }
    }
  }

  const riskScores = {};
  const strategies = {};
  const waveAssignments = {};

  for (const id of sortedIds) {
    const s = serviceMap.get(id);
    const depCount = dependentsMap.get(id).length;
    const score = calculateRiskScore(s, depCount);
    riskScores[id] = score;

    const isLegacy = s.type.toLowerCase().includes('legacy');
    const isCritical = s.criticality === 'critical';

    // Strategy rules:
    // score < 4 AND modern -> Rehost
    // score 4-8 OR 1-2 deps -> Replatform
    // score > 8 OR (legacy AND critical) -> Refactor
    if (score > 8 || (isLegacy && isCritical)) {
      strategies[id] = 'Refactor';
    } else if ((score >= 4 && score <= 8) || s.dependencies.length === 1 || s.dependencies.length === 2) {
      strategies[id] = 'Replatform';
    } else if (score < 4 && !isLegacy) {
      strategies[id] = 'Rehost';
    } else {
      strategies[id] = 'Replatform'; // fallback
    }

    // Wave rules based on dependency depth
    let wave = 1;
    const maxDepWave = s.dependencies.length > 0 
      ? Math.max(...s.dependencies.map(d => waveAssignments[d] || 1)) 
      : 0;

    wave = maxDepWave + 1;

    // Optional: push high-risk services slightly later if they don't have too many dependents
    if (s.dependencies.length === 0) {
      if (score > 12) wave = 3;
      else if (score > 8) wave = 2;
      else wave = 1;
    } else {
      if (score > 12) wave = Math.max(wave, maxDepWave + 2);
    }
    
    waveAssignments[id] = wave;
  }

  // Build waves array
  const waves = [];
  const maxWaveNum = Math.max(...Object.values(waveAssignments), 1);
  for (let i = 1; i <= maxWaveNum; i++) {
    const waveServices = portfolio.services.filter(s => waveAssignments[s.id] === i);
    if (waveServices.length > 0) {
      waves.push({
        id: i,
        name: `Wave ${i}`,
        services: waveServices
      });
    }
  }

  // Get AI Insights
  const aiInsights = await getExplanation(portfolio, waves, riskScores, strategies);

  return {
    portfolio,
    waves,
    riskScores,
    strategies,
    aiInsights
  };
}
