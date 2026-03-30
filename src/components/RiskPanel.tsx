import React from 'react';
import { motion } from 'motion/react';
import { Service } from '../lib/data';

export function RiskPanel({ services }: { services: Service[] }) {
  const topRisks = [...services]
    .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
    .slice(0, 8);

  return (
    <div className="space-y-4">
      {topRisks.map((service, idx) => (
        <motion.div 
          key={service.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`p-3 rounded-lg border bg-gray-50 flex items-center justify-between ${(service.riskScore || 0) >= 60 ? 'border-l-4 border-l-red-500 animate-pulse-border' : 'border-gray-200'}`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-gray-900 truncate">{service.name}</p>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                Wave {service.wave}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5 max-w-[100px]">
                <div 
                  className={`h-1.5 rounded-full ${(service.riskScore || 0) >= 60 ? 'bg-red-500' : (service.riskScore || 0) >= 40 ? 'bg-orange-500' : 'bg-blue-500'}`} 
                  style={{ width: `${service.riskScore}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">{service.riskScore}</span>
            </div>
          </div>
          <div className="ml-4 shrink-0">
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
              service.strategy === 'Rehost' ? 'bg-green-50 text-green-700 ring-green-600/20' :
              service.strategy === 'Replatform' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' :
              service.strategy === 'Refactor' ? 'bg-red-50 text-red-700 ring-red-600/20' :
              'bg-gray-50 text-gray-700 ring-gray-600/20'
            }`}>
              {service.strategy}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
