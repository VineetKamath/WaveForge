import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Service } from '../lib/data';
import { Cloud, Server, Database, AlertTriangle } from 'lucide-react';

interface CloudRecommendation {
  serviceId: string;
  recommendedProvider: 'AWS' | 'Azure' | 'GCP';
  explanation: string;
  comparisons: {
    AWS: { pros: string[]; cons: string[] };
    Azure: { pros: string[]; cons: string[] };
    GCP: { pros: string[]; cons: string[] };
  };
}

export function CloudAdvisorPanel({ services }: { services: Service[] }) {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [recommendation, setRecommendation] = useState<CloudRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendation = async () => {
    if (!selectedServiceId) return;
    
    const service = services.find(s => s.id === selectedServiceId);
    if (!service) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/cloud-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: {
            id: service.id,
            name: service.name,
            type: service.type,
            criticality: service.criticality.toLowerCase(),
            dependencies: service.dependencies,
            uptimeSLA: service.uptime
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get recommendation');
      }

      const data = await response.json();
      setRecommendation(data);
    } catch (err: any) {
      setError(err.message || "Failed to get cloud recommendation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
        <Cloud className="h-6 w-6 text-indigo-600" />
        <h3 className="text-xl font-bold text-gray-900">Cloud Strategy Advisor</h3>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="service-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select a Service to Analyze
          </label>
          <select
            id="service-select"
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
          >
            <option value="">-- Select a Service --</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleGetRecommendation}
          disabled={!selectedServiceId || loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Get Recommendation'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {loading && (
        <div className="animate-pulse space-y-6 mt-6">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-gray-100 rounded-lg"></div>
            <div className="h-32 bg-gray-100 rounded-lg"></div>
            <div className="h-32 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      )}

      {recommendation && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-6"
        >
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
            <h4 className="text-sm font-semibold text-indigo-800 uppercase tracking-wider mb-2">
              Recommended Provider: <span className="text-indigo-900 font-bold">{recommendation.recommendedProvider}</span>
            </h4>
            <p className="text-indigo-900 text-sm leading-relaxed">{recommendation.explanation}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['AWS', 'Azure', 'GCP'] as const).map(provider => (
              <div key={provider} className={`rounded-lg border p-4 ${recommendation.recommendedProvider === provider ? 'border-indigo-500 ring-1 ring-indigo-500 bg-white' : 'border-gray-200 bg-gray-50'}`}>
                <h5 className="font-bold text-gray-900 mb-3 flex items-center justify-between">
                  {provider}
                  {recommendation.recommendedProvider === provider && (
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">Top Pick</span>
                  )}
                </h5>
                <div className="space-y-3">
                  <div>
                    <h6 className="text-xs font-semibold text-green-700 uppercase mb-1">Pros</h6>
                    <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                      {recommendation.comparisons[provider].pros.map((pro, i) => <li key={i}>{pro}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-xs font-semibold text-red-700 uppercase mb-1">Cons</h6>
                    <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                      {recommendation.comparisons[provider].cons.map((con, i) => <li key={i}>{con}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
