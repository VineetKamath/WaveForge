import React, { useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PortfolioInput } from './components/PortfolioInput';
import { Dashboard } from './components/Dashboard';
import { Portfolio, MOCK_PORTFOLIOS } from './lib/data';
import { AnalysisResult, analyzePortfolio } from './lib/engine';
import { Toaster, toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function App() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async (p: Portfolio) => {
    setPortfolio(p);
    try {
      const res = await analyzePortfolio(p);
      setResult(res);
      setTimeout(() => {
        dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error: any) {
      toast.error(error.message || "Failed to analyze portfolio");
    }
  };

  const handleDemo = () => {
    const demoPortfolio = MOCK_PORTFOLIOS.find(p => p.sector === 'E-Commerce (RetailCorp)');
    if (demoPortfolio) {
      handleAnalyze(demoPortfolio);
    } else {
      toast.error("Demo portfolio not found.");
    }
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

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text(`WaveForge Migration Plan`, 14, 22);
    
    // Portfolio Info
    doc.setFontSize(12);
    doc.text(`Portfolio: ${result.portfolio.name}`, 14, 32);
    doc.text(`Sector: ${result.portfolio.sector}`, 14, 40);
    doc.text(`Total Services: ${result.portfolio.services.length}`, 14, 48);
    doc.text(`Total Waves: ${result.waves}`, 14, 56);

    let startY = 66;

    // Waves Table
    for (let w = 1; w <= result.waves; w++) {
      const waveServices = result.portfolio.services.filter(s => s.wave === w);
      
      if (waveServices.length > 0) {
        autoTable(doc, {
          startY: startY,
          head: [[`Wave ${w} Services`, 'Type', 'Strategy', 'Criticality', 'Risk Score']],
          body: waveServices.map(s => [
            s.name,
            s.type,
            s.strategy || 'Unknown',
            s.criticality,
            s.riskScore?.toString() || '0'
          ]),
          theme: 'grid',
          headStyles: { fillColor: [37, 99, 235] }, // blue-600
          margin: { top: 10 }
        });
        
        startY = (doc as any).lastAutoTable.finalY + 10;
      }
    }

    // Violations
    if (result.violations.length > 0) {
      autoTable(doc, {
        startY: startY,
        head: [['Dependency Violations', 'Issue']],
        body: result.violations.map(v => {
          const source = result.portfolio.services.find(s => s.id === v.sourceId)?.name;
          const target = result.portfolio.services.find(s => s.id === v.targetId)?.name;
          return [
            `${source} -> ${target}`,
            `${source} is scheduled in the same or earlier wave than its dependency ${target}.`
          ];
        }),
        theme: 'grid',
        headStyles: { fillColor: [239, 68, 68] }, // red-500
        margin: { top: 10 }
      });
    }

    doc.save(`${result.portfolio.name.replace(/\s+/g, '_')}_Migration_Plan.pdf`);
    toast.success("Migration plan exported as PDF successfully.");
  };

  const handleNavigate = (section: string) => {
    if (section === 'overview') {
      if (portfolio) {
        document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (section === 'analyze') {
      if (portfolio) {
        document.getElementById('dependency-graph')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        document.getElementById('analyze')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (section === 'simulate') {
      if (!portfolio) {
        toast.error("Please load and analyze a portfolio first to simulate.");
      } else {
        document.getElementById('simulate')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Toaster position="top-right" />
      <Navbar onExport={handleExport} onNavigate={handleNavigate} />
      
      {!portfolio ? (
        <>
          <Hero onDemo={handleDemo} />
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
