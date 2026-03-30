export type Criticality = 'Critical' | 'High' | 'Medium' | 'Low';
export type Strategy = 'Rehost' | 'Replatform' | 'Refactor' | 'Retain' | 'Retire';

export interface Service {
  id: string;
  name: string;
  type: string;
  criticality: Criticality;
  dependencies: string[]; // IDs of services this service depends on
  uptime: number; // e.g., 99.9
  // Computed fields
  wave?: number;
  strategy?: Strategy;
  riskScore?: number;
  dependents?: string[]; // IDs of services that depend on this service
}

export interface Portfolio {
  id: string;
  name: string;
  sector: string;
  services: Service[];
}

export const SECTORS = [
  'E-Commerce (RetailCorp)',
  'Healthcare (MedAxis)',
  'Fintech (Apex Financial)',
  'Media (NovaCast)',
  'Logistics (FreightAxis)'
];

export const MOCK_PORTFOLIOS: Portfolio[] = [
  {
    id: 'p1',
    name: 'RetailCorp',
    sector: 'E-Commerce (RetailCorp)',
    services: [
      { id: 's1', name: 'Product Catalog', type: 'Database', criticality: 'High', dependencies: [], uptime: 99.9 },
      { id: 's2', name: 'Inventory Management', type: 'Legacy App', criticality: 'Critical', dependencies: ['s1'], uptime: 99.5 },
      { id: 's3', name: 'Order Processing', type: 'Application', criticality: 'Critical', dependencies: ['s2', 's5'], uptime: 99.9 },
      { id: 's4', name: 'Storefront UI', type: 'Frontend', criticality: 'High', dependencies: ['s1', 's3'], uptime: 99.0 },
      { id: 's5', name: 'Payment Gateway', type: 'Integration', criticality: 'Critical', dependencies: [], uptime: 99.99 },
      { id: 's6', name: 'Recommendation Engine', type: 'Analytics', criticality: 'Medium', dependencies: ['s1'], uptime: 98.5 },
      { id: 's7', name: 'User Reviews', type: 'Microservice', criticality: 'Low', dependencies: ['s1'], uptime: 99.0 },
      { id: 's8', name: 'Shipping API', type: 'API', criticality: 'High', dependencies: ['s3'], uptime: 99.5 },
      { id: 's9', name: 'User Authentication', type: 'Microservice', criticality: 'Critical', dependencies: ['s1'], uptime: 99.99 },
      { id: 's10', name: 'Email Service', type: 'Integration', criticality: 'Low', dependencies: [], uptime: 99.0 },
      { id: 's11', name: 'Search Service', type: 'Analytics', criticality: 'Medium', dependencies: ['s1'], uptime: 99.5 },
      { id: 's12', name: 'Analytics Dashboard', type: 'Frontend', criticality: 'Low', dependencies: ['s6'], uptime: 98.0 },
    ],
  },
  {
    id: 'p2',
    name: 'MedAxis',
    sector: 'Healthcare (MedAxis)',
    services: [
      { id: 'h1', name: 'Patient Records DB', type: 'Database', criticality: 'Critical', dependencies: [], uptime: 99.99 },
      { id: 'h2', name: 'Appointment Scheduler', type: 'Legacy App', criticality: 'High', dependencies: ['h1'], uptime: 99.5 },
      { id: 'h3', name: 'Billing System', type: 'Application', criticality: 'High', dependencies: ['h1'], uptime: 99.9 },
      { id: 'h4', name: 'Telehealth Video', type: 'Media', criticality: 'Critical', dependencies: ['h2'], uptime: 99.0 },
      { id: 'h5', name: 'Doctor Portal', type: 'Frontend', criticality: 'Medium', dependencies: ['h1', 'h2'], uptime: 99.5 },
      { id: 'h6', name: 'Pharmacy API', type: 'API', criticality: 'High', dependencies: ['h1'], uptime: 99.9 },
      { id: 'h7', name: 'Lab Results Sync', type: 'Integration', criticality: 'Medium', dependencies: ['h1'], uptime: 98.0 },
      { id: 'h8', name: 'Patient Portal Mobile', type: 'Frontend', criticality: 'High', dependencies: ['h6'], uptime: 99.5 },
      { id: 'h9', name: 'Notification Service', type: 'Integration', criticality: 'Medium', dependencies: [], uptime: 99.0 },
      { id: 'h10', name: 'Insurance Verification', type: 'API', criticality: 'Critical', dependencies: ['h1'], uptime: 99.9 },
      { id: 'h11', name: 'Document Storage', type: 'Database', criticality: 'Medium', dependencies: [], uptime: 99.5 },
      { id: 'h12', name: 'Analytics Data Warehouse', type: 'Database', criticality: 'Low', dependencies: ['h1'], uptime: 98.5 },
    ],
  },
  {
    id: 'p3',
    name: 'Apex Financial',
    sector: 'Fintech (Apex Financial)',
    services: [
      { id: 'f1', name: 'Core Banking DB', type: 'Database', criticality: 'Critical', dependencies: [], uptime: 99.99 },
      { id: 'f2', name: 'Transaction API', type: 'API', criticality: 'Critical', dependencies: ['f1'], uptime: 99.95 },
      { id: 'f3', name: 'Mobile App Backend', type: 'Backend', criticality: 'High', dependencies: ['f2'], uptime: 99.9 },
      { id: 'f4', name: 'Fraud Detection', type: 'Analytics', criticality: 'High', dependencies: ['f1', 'f2'], uptime: 99.5 },
      { id: 'f5', name: 'Customer Portal', type: 'Frontend', criticality: 'Medium', dependencies: ['f2', 'f3'], uptime: 99.0 },
      { id: 'f6', name: 'Reporting Service', type: 'Legacy App', criticality: 'Low', dependencies: ['f1'], uptime: 98.5 },
      { id: 'f7', name: 'Loan Processing', type: 'Application', criticality: 'High', dependencies: ['f1', 'f2'], uptime: 99.5 },
      { id: 'f8', name: 'Credit Scoring API', type: 'API', criticality: 'Critical', dependencies: ['f1'], uptime: 99.9 },
      { id: 'f9', name: 'Notification Gateway', type: 'Integration', criticality: 'Medium', dependencies: [], uptime: 99.0 },
      { id: 'f10', name: 'Audit Logging', type: 'Microservice', criticality: 'High', dependencies: [], uptime: 99.99 },
      { id: 'f11', name: 'Admin Dashboard', type: 'Frontend', criticality: 'Low', dependencies: ['f6'], uptime: 98.0 },
      { id: 'f12', name: 'Market Data Feed', type: 'Integration', criticality: 'Medium', dependencies: [], uptime: 99.5 },
    ],
  },
  {
    id: 'p4',
    name: 'NovaCast',
    sector: 'Media (NovaCast)',
    services: [
      { id: 'm1', name: 'Content DB', type: 'Database', criticality: 'High', dependencies: [], uptime: 99.9 },
      { id: 'm2', name: 'Video Transcoder', type: 'Application', criticality: 'Critical', dependencies: ['m1'], uptime: 99.5 },
      { id: 'm3', name: 'Streaming CDN', type: 'Integration', criticality: 'Critical', dependencies: ['m2'], uptime: 99.9 },
      { id: 'm4', name: 'User Profiles', type: 'Database', criticality: 'Medium', dependencies: [], uptime: 99.0 },
      { id: 'm5', name: 'Web Player', type: 'Frontend', criticality: 'High', dependencies: ['m3', 'm4'], uptime: 99.5 },
      { id: 'm6', name: 'Ad Server', type: 'Application', criticality: 'High', dependencies: ['m4'], uptime: 99.5 },
      { id: 'm7', name: 'Recommendation Engine', type: 'Analytics', criticality: 'Medium', dependencies: ['m1', 'm4'], uptime: 99.0 },
      { id: 'm8', name: 'Mobile App', type: 'Frontend', criticality: 'High', dependencies: ['m3', 'm4'], uptime: 99.5 },
      { id: 'm9', name: 'Analytics DB', type: 'Database', criticality: 'Low', dependencies: [], uptime: 98.5 },
      { id: 'm10', name: 'Payment Processing', type: 'Integration', criticality: 'Critical', dependencies: ['m4'], uptime: 99.99 },
    ],
  },
  {
    id: 'p5',
    name: 'FreightAxis',
    sector: 'Logistics (FreightAxis)',
    services: [
      { id: 'l1', name: 'Fleet Tracker', type: 'Legacy App', criticality: 'Critical', dependencies: [], uptime: 99.9 },
      { id: 'l2', name: 'Route Optimizer', type: 'Analytics', criticality: 'High', dependencies: ['l1'], uptime: 99.5 },
      { id: 'l3', name: 'Driver App API', type: 'API', criticality: 'High', dependencies: ['l1', 'l2'], uptime: 99.9 },
      { id: 'l4', name: 'Warehouse DB', type: 'Database', criticality: 'Medium', dependencies: [], uptime: 99.0 },
      { id: 'l5', name: 'Inventory Sync', type: 'Integration', criticality: 'Medium', dependencies: ['l4'], uptime: 99.5 },
      { id: 'l6', name: 'Customer Tracking Portal', type: 'Frontend', criticality: 'Medium', dependencies: ['l3'], uptime: 99.0 },
      { id: 'l7', name: 'Billing Service', type: 'Application', criticality: 'High', dependencies: ['l4'], uptime: 99.5 },
      { id: 'l8', name: 'Weather API Integration', type: 'Integration', criticality: 'Low', dependencies: [], uptime: 99.0 },
      { id: 'l9', name: 'Maintenance Log', type: 'Database', criticality: 'Medium', dependencies: [], uptime: 99.5 },
      { id: 'l10', name: 'Dispatch System', type: 'Legacy App', criticality: 'Critical', dependencies: ['l1', 'l4'], uptime: 99.9 },
    ],
  },
];
