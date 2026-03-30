import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Activity, ShieldAlert, Cpu } from 'lucide-react';

interface Props {
  onDemo: () => void;
}

export function Hero({ onDemo }: Props) {
  return (
    <div id="overview" className="relative overflow-hidden bg-gray-50 pt-16 pb-32 sm:pt-24 sm:pb-40 lg:pb-48">
      <div className="absolute inset-0 z-0">
        <svg className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]" aria-hidden="true">
          <defs>
            <pattern id="e813992c-7d03-4cc4-a2bd-151760b470a0" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
          >
            Intelligent Cloud Migration <span className="text-blue-600">Wave Planning</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-lg leading-8 text-gray-600"
          >
            Analyze dependencies, assess risks, and generate optimized migration waves with AI-powered insights. Drag-and-drop to simulate scenarios instantly.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <a href="#analyze" className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 flex items-center">
              Start Analysis <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <button onClick={onDemo} className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors">
              See a Live Demo <span aria-hidden="true">→</span>
            </button>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl"
        >
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <Activity className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Dependency Mapping
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">Automatically resolve circular dependencies and visualize complex service relationships.</dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <ShieldAlert className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Risk Assessment
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">Identify high-risk services based on criticality, dependents, and uptime metrics.</dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <Cpu className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                AI Insights
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">Generate executive summaries and actionable recommendations using Gemini AI.</dd>
            </div>
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">How WaveForge Works</h2>
                <p className="mt-4 text-lg text-gray-600">
                  Our platform simplifies complex cloud migrations into a manageable, step-by-step process.
                </p>
                <ol className="mt-8 space-y-6 text-gray-600">
                  <li className="flex gap-x-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">1</span>
                    <span><strong className="font-semibold text-gray-900">Load Portfolio:</strong> Import your existing application landscape via JSON or use our industry templates.</span>
                  </li>
                  <li className="flex gap-x-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">2</span>
                    <span><strong className="font-semibold text-gray-900">AI Analysis:</strong> Our engine analyzes dependencies, calculates risk scores, and determines the optimal migration strategy (6 Rs).</span>
                  </li>
                  <li className="flex gap-x-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">3</span>
                    <span><strong className="font-semibold text-gray-900">Simulate & Refine:</strong> Use the interactive Wave Timeline to drag and drop services, instantly seeing the impact on dependencies.</span>
                  </li>
                  <li className="flex gap-x-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">4</span>
                    <span><strong className="font-semibold text-gray-900">Export Plan:</strong> Generate a comprehensive, boardroom-ready PDF migration plan with step-by-step playbooks.</span>
                  </li>
                </ol>
              </div>
              <div className="bg-gray-50 p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-gray-200 flex items-center justify-center">
                <div className="w-full max-w-md space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">✓</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Zero Downtime Planning</h4>
                      <p className="text-sm text-gray-500">Dependency-aware wave generation</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">AI</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Gemini-Powered Insights</h4>
                      <p className="text-sm text-gray-500">Automated risk mitigation strategies</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">☁️</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Multi-Cloud Ready</h4>
                      <p className="text-sm text-gray-500">AWS, Azure, and GCP recommendations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
