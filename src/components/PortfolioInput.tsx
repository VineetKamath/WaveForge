import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Portfolio, MOCK_PORTFOLIOS, SECTORS } from '../lib/data';
import { ChevronDown, Upload, Play } from 'lucide-react';

interface Props {
  onAnalyze: (portfolio: Portfolio) => void;
}

export function PortfolioInput({ onAnalyze }: Props) {
  const [selectedSector, setSelectedSector] = useState<string>(SECTORS[0]);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [jsonInput, setJsonInput] = useState('');
  const [showJson, setShowJson] = useState(false);

  const handleLoad = () => {
    const p = MOCK_PORTFOLIOS.find(p => p.sector === selectedSector);
    if (p) setPortfolio(p);
  };

  const handleJsonPaste = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (parsed.services && Array.isArray(parsed.services)) {
        setPortfolio(parsed);
      } else {
        alert("Invalid JSON format. Must contain a 'services' array.");
      }
    } catch (e) {
      alert("Invalid JSON.");
    }
  };

  return (
    <section id="analyze" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Load Portfolio</h2>
          <p className="mt-4 text-lg text-gray-600">Select an industry template or paste your own JSON data.</p>
        </div>

        <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry Sector</label>
              <div className="relative">
                <select
                  className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-4 py-3 pr-8 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                >
                  {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
            <button
              onClick={handleLoad}
              className="w-full md:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              <Upload className="mr-2 h-5 w-5" /> Load Template
            </button>
          </div>

          <div className="mt-6">
            <button 
              onClick={() => setShowJson(!showJson)}
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              {showJson ? 'Hide JSON Input' : 'Or paste custom JSON'}
            </button>
            
            {showJson && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4"
              >
                <textarea
                  rows={6}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono p-3 border"
                  placeholder='{"name": "Custom", "sector": "Tech", "services": [...] }'
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                />
                <button
                  onClick={handleJsonPaste}
                  className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Apply JSON
                </button>
              </motion.div>
            )}
          </div>

          {portfolio && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">{portfolio.name}</h3>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mt-1">
                    {portfolio.sector}
                  </span>
                </div>
                <button
                  onClick={() => onAnalyze(portfolio)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Analyze Portfolio <Play className="ml-2 -mr-1 h-5 w-5" />
                </button>
              </div>

              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Service Name</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Criticality</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Dependencies</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Uptime</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {portfolio.services.map((service, idx) => (
                      <motion.tr 
                        key={service.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{service.name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{service.type}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            service.criticality === 'Critical' ? 'bg-red-50 text-red-700 ring-red-600/10' :
                            service.criticality === 'High' ? 'bg-orange-50 text-orange-700 ring-orange-600/10' :
                            service.criticality === 'Medium' ? 'bg-blue-50 text-blue-700 ring-blue-600/10' :
                            'bg-green-50 text-green-700 ring-green-600/10'
                          }`}>
                            {service.criticality}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{service.dependencies.length}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{service.uptime}%</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
