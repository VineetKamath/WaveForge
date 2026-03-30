import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Activity, ShieldAlert, Cpu } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gray-50 pt-16 pb-32 sm:pt-24 sm:pb-40 lg:pb-48">
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
            <a href="#overview" className="text-sm font-semibold leading-6 text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </a>
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
      </div>
    </div>
  );
}
