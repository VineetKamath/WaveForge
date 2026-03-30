import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Service } from '../lib/data';
import { CheckSquare, Download, Loader2, X, AlertTriangle } from 'lucide-react';

interface MigrationStep {
  phase: string;
  tasks: string[];
}

interface PlaybookResponse {
  serviceId: string;
  provider: string;
  steps: MigrationStep[];
}

export function MigrationPlaybook({ service, onClose }: { service: Service, onClose: () => void }) {
  const [playbook, setPlaybook] = useState<PlaybookResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load checked tasks from localStorage
    const stored = localStorage.getItem(`waveforge_playbook_${service.id}`);
    if (stored) {
      try {
        setCheckedTasks(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored playbook progress", e);
      }
    }

    async function fetchPlaybook() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/migration-steps', {
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
            },
            provider: 'AWS' // Defaulting to AWS for the playbook, or could be dynamic
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to get migration steps');
        }

        const data = await response.json();
        setPlaybook(data);
      } catch (err: any) {
        setError(err.message || "Failed to load migration playbook.");
      } finally {
        setLoading(false);
      }
    }

    fetchPlaybook();
  }, [service]);

  const toggleTask = (task: string) => {
    const newChecked = { ...checkedTasks, [task]: !checkedTasks[task] };
    setCheckedTasks(newChecked);
    localStorage.setItem(`waveforge_playbook_${service.id}`, JSON.stringify(newChecked));
  };

  const handleExport = () => {
    if (!playbook) return;

    let content = `Migration Playbook: ${service.name} (${service.type})\n`;
    content += `Target Provider: ${playbook.provider}\n\n`;

    playbook.steps.forEach(step => {
      content += `[${step.phase.toUpperCase()}]\n`;
      step.tasks.forEach(task => {
        const isDone = checkedTasks[task] ? '[x]' : '[ ]';
        content += `${isDone} ${task}\n`;
      });
      content += '\n';
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${service.name.replace(/\s+/g, '_')}_Playbook.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-6 border-t border-gray-200 pt-6 overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-indigo-600" />
            Migration Playbook: {service.name}
          </h4>
          <p className="text-sm text-gray-500">Track your step-by-step migration progress.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleExport}
            disabled={!playbook || loading}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> Export
          </button>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Generating playbook...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {playbook && !loading && (
        <div className="space-y-6">
          {playbook.steps.map((step, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h5 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">{step.phase}</h5>
              <div className="space-y-2">
                {step.tasks.map((task, j) => (
                  <label key={j} className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-start pt-0.5">
                      <input 
                        type="checkbox" 
                        checked={!!checkedTasks[task]}
                        onChange={() => toggleTask(task)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                      />
                    </div>
                    <span className={`text-sm ${checkedTasks[task] ? 'text-gray-400 line-through' : 'text-gray-700 group-hover:text-gray-900'}`}>
                      {task}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
