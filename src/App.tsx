import React, { useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PortfolioInput } from './components/PortfolioInput';
import { Dashboard } from './components/Dashboard';
import { Portfolio } from './lib/data';
import { AnalysisResult, analyzePortfolio } from './lib/engine';
import { Toaster, toast } from 'sonner';

export default function App() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = (p: Portfolio) => {
    setPortfolio(p);
    setResult(analyzePortfolio(p));
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setPortfolio(null);
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExport = () => {
    if (!result) {
      toast.error("No analysis to export. Please analyze a portfolio first.");
      return;
    }

    let content = `WaveForge Migration Plan: ${result.portfolio.name}\n`;
    content += `Sector: ${result.portfolio.sector}\n`;
    content += `Total Services: ${result.portfolio.services.length}\n`;
    content += `Total Waves: ${result.waves}\n\n`;

    for (let w = 1; w <= result.waves; w++) {
      content += `--- WAVE ${w} ---\n`;
      const waveServices = result.portfolio.services.filter(s => s.wave === w);
      waveServices.forEach(s => {
        content += `- ${s.name} (${s.type}) | Strategy: ${s.strategy} | Risk: ${s.riskScore}\n`;
      });
      content += `\n`;
    }

    if (result.violations.length > 0) {
      content += `--- DEPENDENCY VIOLATIONS ---\n`;
      result.violations.forEach(v => {
        const source = result.portfolio.services.find(s => s.id === v.sourceId)?.name;
        const target = result.portfolio.services.find(s => s.id === v.targetId)?.name;
        content += `- ${source} depends on ${target} but is scheduled in the same or earlier wave.\n`;
      });
      content += `\n`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.portfolio.name.replace(/\s+/g, '_')}_Migration_Plan.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Migration plan exported successfully.");
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Toaster position="top-right" />
      <Navbar onExport={handleExport} />
      
      {!portfolio ? (
        <>
          <Hero />
          <PortfolioInput onAnalyze={handleAnalyze} />
        </>
      ) : (
        <div ref={dashboardRef}>
          <Dashboard 
            portfolio={portfolio} 
            result={result} 
            setResult={setResult} 
            onReset={handleReset} 
          />
        </div>
      )}
    </div>
  );
}
