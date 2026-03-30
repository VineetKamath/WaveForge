import React from 'react';
import { Service } from '../lib/data';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface Props {
  services: Service[];
}

export function MetricsOverview({ services }: Props) {
  // Strategy Distribution
  const strategyCounts = services.reduce((acc, s) => {
    const strategy = s.strategy || 'Unknown';
    acc[strategy] = (acc[strategy] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const strategyData = Object.keys(strategyCounts).map(key => ({
    name: key,
    value: strategyCounts[key]
  }));

  const STRATEGY_COLORS: Record<string, string> = {
    'Rehost': '#3b82f6', // blue
    'Replatform': '#8b5cf6', // purple
    'Refactor': '#ec4899', // pink
    'Retain': '#64748b', // slate
    'Retire': '#ef4444', // red
    'Unknown': '#cbd5e1'
  };

  // Risk Distribution
  const riskCounts = services.reduce((acc, s) => {
    const risk = s.criticality || 'Unknown';
    acc[risk] = (acc[risk] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const riskData = [
    { name: 'Critical', count: riskCounts['Critical'] || 0, fill: '#ef4444' },
    { name: 'High', count: riskCounts['High'] || 0, fill: '#f97316' },
    { name: 'Medium', count: riskCounts['Medium'] || 0, fill: '#3b82f6' },
    { name: 'Low', count: riskCounts['Low'] || 0, fill: '#22c55e' }
  ].filter(d => d.count > 0);

  // Wave Distribution
  const waveCounts = services.reduce((acc, s) => {
    if (s.wave !== undefined) {
      acc[s.wave] = (acc[s.wave] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);

  const waveData = Object.keys(waveCounts).map(key => ({
    wave: `Wave ${key}`,
    services: waveCounts[Number(key)]
  })).sort((a, b) => a.wave.localeCompare(b.wave));

  // Service Types Distribution
  const typeCounts = services.reduce((acc, s) => {
    const type = s.type || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeData = Object.keys(typeCounts).map(key => ({
    name: key,
    value: typeCounts[key]
  })).sort((a, b) => b.value - a.value);

  const TYPE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b', '#14b8a6', '#f43f5e'];

  // Uptime SLA Distribution
  const uptimeCounts = services.reduce((acc, s) => {
    let category = '';
    if (s.uptime >= 99.99) category = '99.99%+';
    else if (s.uptime >= 99.9) category = '99.9%+';
    else if (s.uptime >= 99.0) category = '99.0%+';
    else category = '< 99.0%';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uptimeData = [
    { name: '99.99%+', count: uptimeCounts['99.99%+'] || 0, fill: '#10b981' },
    { name: '99.9%+', count: uptimeCounts['99.9%+'] || 0, fill: '#3b82f6' },
    { name: '99.0%+', count: uptimeCounts['99.0%+'] || 0, fill: '#f59e0b' },
    { name: '< 99.0%', count: uptimeCounts['< 99.0%'] || 0, fill: '#ef4444' }
  ].filter(d => d.count > 0);

  // Dependency Complexity
  const depCounts = services.reduce((acc, s) => {
    const deps = s.dependencies.length;
    let category = '';
    if (deps === 0) category = '0 (Standalone)';
    else if (deps <= 2) category = '1-2 (Low)';
    else if (deps <= 4) category = '3-4 (Medium)';
    else category = '5+ (High)';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const depData = [
    { name: '0 (Standalone)', count: depCounts['0 (Standalone)'] || 0, fill: '#22c55e' },
    { name: '1-2 (Low)', count: depCounts['1-2 (Low)'] || 0, fill: '#3b82f6' },
    { name: '3-4 (Medium)', count: depCounts['3-4 (Medium)'] || 0, fill: '#f97316' },
    { name: '5+ (High)', count: depCounts['5+ (High)'] || 0, fill: '#ef4444' }
  ].filter(d => d.count > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Strategy Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Migration Strategies</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={strategyData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {strategyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STRATEGY_COLORS[entry.name] || STRATEGY_COLORS['Unknown']} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} Services`, 'Count']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service Types Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Service Types</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} Services`, 'Count']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Wave Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Services per Wave</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="wave" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="services" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk/Criticality Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Service Criticality</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={riskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Uptime SLA Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Uptime SLA Requirements</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={uptimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {uptimeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dependency Complexity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Dependency Complexity</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={depData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {depData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
