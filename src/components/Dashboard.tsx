import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Portfolio, Service } from '../lib/data';
import { AnalysisResult, analyzePortfolio, checkViolations } from '../lib/engine';
import { DependencyGraph } from './DependencyGraph';
import { WaveTimeline } from './WaveTimeline';
import { RiskPanel } from './RiskPanel';
import { AIInsightsPanel } from './AIInsightsPanel';
import { CloudAdvisorPanel } from './CloudAdvisorPanel';
import { MetricsOverview } from './MetricsOverview';
import { toast } from 'sonner';

interface Props {
  portfolio: Portfolio;
  result: AnalysisResult | null;
  setResult: (result: AnalysisResult) => void;
  onReset: () => void;
}

export function Dashboard({ portfolio, result, setResult, onReset }: Props) {
  const [highlightedService, setHighlightedService] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleMoveService = (serviceId: string, newWave: number) => {
    if (!result) return;
    
    setIsSimulating(true);
    const updatedServices = result.portfolio.services.map(s => 
      s.id === serviceId ? { ...s, wave: newWave } : s
    );
    
    const violations = checkViolations(updatedServices);
    
    setResult({
      ...result,
      portfolio: { ...result.portfolio, services: updatedServices },
      violations
    });

    if (violations.length > 0) {
      const brokenCount = violations.filter(v => v.sourceId === serviceId || v.targetId === serviceId).length;
      if (brokenCount > 0) {
        toast.error(`Moving ${updatedServices.find(s=>s.id===serviceId)?.name} to Wave ${newWave} breaks ${brokenCount} dependencies`);
      }
    } else {
      toast.success("Move successful. No violations.");
    }
  };

  const handleReanalyze = async () => {
    try {
      const freshResult = await analyzePortfolio(result?.portfolio || portfolio);
      setResult(freshResult);
      setIsSimulating(false);
      toast.success("Portfolio re-analyzed and optimized.");
    } catch (err: any) {
      toast.error(err.message || "Failed to re-analyze");
    }
  };

  if (!result) {
    return (
      <div className="bg-gray-50 min-h-screen pb-24" id="dashboard">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Analysis Dashboard</h2>
              <p className="text-sm text-gray-500">Portfolio: {portfolio.name}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 h-[500px] animate-pulse flex items-center justify-center">
            <div className="text-gray-400 font-medium">Analyzing dependencies...</div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse h-64 flex items-center justify-center">
              <div className="text-gray-400 font-medium">Planning waves...</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse h-64 flex items-center justify-center">
              <div className="text-gray-400 font-medium">Calculating risks...</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse h-64 flex items-center justify-center">
            <div className="text-gray-400 font-medium">Generating AI Insights...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24" id="dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analysis Dashboard</h2>
            <p className="text-sm text-gray-500">Portfolio: {result.portfolio.name}</p>
          </div>
          <div className="flex gap-4">
            {isSimulating && (
              <button 
                onClick={handleReanalyze}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200"
              >
                Re-analyze with AI
              </button>
            )}
            <button 
              onClick={onReset}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset Plan
            </button>
          </div>
        </div>

        {/* Panel A: Dependency Graph */}
        <div 
          id="dependency-graph"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 h-[500px] relative overflow-hidden"
          onClick={() => setHighlightedService(null)}
        >
          <h3 className="text-lg font-semibold mb-4 absolute top-6 left-6 z-10">Dependency Graph</h3>
          <DependencyGraph 
            services={result.portfolio.services} 
            violations={result.violations}
            highlightedId={highlightedService}
          />
        </div>

        {/* Panel A.5: Metrics Overview */}
        <div className="mb-8">
          <MetricsOverview services={result.portfolio.services} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Panel B: Wave Timeline */}
          <div id="simulate" className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Wave Timeline (Simulator)</h3>
            <p className="text-sm text-gray-500 mb-6">Drag services between waves to simulate changes.</p>
            <WaveTimeline 
              services={result.portfolio.services} 
              waves={result.waves}
              onMoveService={handleMoveService}
              onHoverService={setHighlightedService}
            />
          </div>

          {/* Panel C: Risk Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Top Risks</h3>
            <RiskPanel services={result.portfolio.services} />
          </div>
        </div>

        {/* Panel D: AI Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <AIInsightsPanel insights={result.aiInsights} />
        </div>

        {/* Panel E: Cloud Strategy Advisor */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <CloudAdvisorPanel services={result.portfolio.services} />
        </div>
      </div>
    </div>
  );
}
