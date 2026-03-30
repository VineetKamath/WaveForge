import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, AlertTriangle, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export interface AIInsights {
  executiveSummary: string;
  keyRisks: string[];
  waveRationale: { wave: number; rationale: string }[];
  recommendedActions: string[];
  confidenceScore: number;
  estimatedDuration: string;
}

export function AIInsightsPanel({ insights }: { insights: AIInsights }) {
  const [expandedWave, setExpandedWave] = useState<number | null>(null);

  if (!insights) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
        <Sparkles className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">AI Executive Analysis</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Executive Summary</h4>
            <p className="text-gray-800 leading-relaxed text-lg">{insights.executiveSummary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" /> Key Risks
              </h4>
              <ul className="space-y-2">
                {insights.keyRisks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-orange-50 p-2 rounded-md border border-orange-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" /> Recommended Actions
              </h4>
              <ul className="space-y-2">
                {insights.recommendedActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-green-50 p-2 rounded-md border border-green-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Wave Rationale</h4>
            <div className="space-y-2">
              {insights.waveRationale.map((wr, i) => (
                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setExpandedWave(expandedWave === wr.wave ? null : wr.wave)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  >
                    <span className="font-medium text-gray-900">Wave {wr.wave} Strategy</span>
                    {expandedWave === wr.wave ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                  </button>
                  <AnimatePresence>
                    {expandedWave === wr.wave && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-4 bg-white text-sm text-gray-700 border-t border-gray-200"
                      >
                        {wr.rationale}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 text-center">
            <h4 className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-4">Confidence Score</h4>
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-blue-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <motion.path
                  className="text-blue-600"
                  strokeDasharray={`${insights.confidenceScore}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${insights.confidenceScore}, 100` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-blue-900">{insights.confidenceScore}</span>
                <span className="text-xs text-blue-700">/ 100</span>
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-4">Based on dependency complexity and risk factors.</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex items-center gap-4">
            <div className="bg-white p-3 rounded-full shadow-sm">
              <Clock className="h-6 w-6 text-gray-700" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Est. Duration</h4>
              <p className="text-lg font-bold text-gray-900">{insights.estimatedDuration}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
