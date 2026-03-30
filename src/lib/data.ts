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

export const SECTORS = ['Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Tech'];

export const MOCK_PORTFOLIOS: Portfolio[] = [
  {
    id: 'p1',
    name: 'Global Bank Corp',
    sector: 'Finance',
    services: [
      { id: 's1', name: 'Core Banking DB', type: 'Database', criticality: 'Critical', dependencies: [], uptime: 99.99 },
      { id: 's2', name: 'Transaction API', type: 'API', criticality: 'Critical', dependencies: ['s1'], uptime: 99.95 },
      { id: 's3', name: 'Mobile App Backend', type: 'Backend', criticality: 'High', dependencies: ['s2'], uptime: 99.9 },
      { id: 's4', name: 'Fraud Detection', type: 'Analytics', criticality: 'High', dependencies: ['s1', 's2'], uptime: 99.5 },
      { id: 's5', name: 'Customer Portal', type: 'Frontend', criticality: 'Medium', dependencies: ['s2', 's3'], uptime: 99.0 },
      { id: 's6', name: 'Reporting Service', type: 'Analytics', criticality: 'Low', dependencies: ['s1'], uptime: 98.5 },
      { id: 's7', name: 'Legacy Auth', type: 'Security', criticality: 'High', dependencies: ['s1'], uptime: 99.9 },
      { id: 's8', name: 'New Auth Gateway', type: 'Security', criticality: 'Critical', dependencies: [], uptime: 99.99 },
      { id: 's9', name: 'Notification Service', type: 'Microservice', criticality: 'Medium', dependencies: ['s2'], uptime: 99.9 },
      { id: 's10', name: 'Audit Log DB', type: 'Database', criticality: 'High', dependencies: [], uptime: 99.99 },
    ],
  },
  {
    id: 'p2',
    name: 'HealthPlus Systems',
    sector: 'Healthcare',
    services: [
      { id: 'h1', name: 'Patient Records DB', type: 'Database', criticality: 'Critical', dependencies: [], uptime: 99.99 },
      { id: 'h2', name: 'Appointment Scheduler', type: 'Application', criticality: 'High', dependencies: ['h1'], uptime: 99.5 },
      { id: 'h3', name: 'Billing System', type: 'Application', criticality: 'High', dependencies: ['h1'], uptime: 99.9 },
      { id: 'h4', name: 'Telehealth Video', type: 'Media', criticality: 'Critical', dependencies: ['h2'], uptime: 99.0 },
      { id: 'h5', name: 'Doctor Portal', type: 'Frontend', criticality: 'Medium', dependencies: ['h1', 'h2'], uptime: 99.5 },
      { id: 'h6', name: 'Pharmacy API', type: 'API', criticality: 'High', dependencies: ['h1'], uptime: 99.9 },
      { id: 'h7', name: 'Lab Results Sync', type: 'Integration', criticality: 'Medium', dependencies: ['h1'], uptime: 98.0 },
    ],
  },
  {
    id: 'p3',
    name: 'ShopSmart E-commerce',
    sector: 'Retail',
    services: [
      { id: 'r1', name: 'Product Catalog', type: 'Database', criticality: 'High', dependencies: [], uptime: 99.9 },
      { id: 'r2', name: 'Inventory Management', type: 'Application', criticality: 'Critical', dependencies: ['r1'], uptime: 99.5 },
      { id: 'r3', name: 'Order Processing', type: 'Application', criticality: 'Critical', dependencies: ['r2', 'r5'], uptime: 99.9 },
      { id: 'r4', name: 'Storefront UI', type: 'Frontend', criticality: 'High', dependencies: ['r1', 'r3'], uptime: 99.0 },
      { id: 'r5', name: 'Payment Gateway', type: 'Integration', criticality: 'Critical', dependencies: [], uptime: 99.99 },
      { id: 'r6', name: 'Recommendation Engine', type: 'Analytics', criticality: 'Medium', dependencies: ['r1'], uptime: 98.5 },
      { id: 'r7', name: 'User Reviews', type: 'Microservice', criticality: 'Low', dependencies: ['r1'], uptime: 99.0 },
      { id: 'r8', name: 'Shipping API', type: 'API', criticality: 'High', dependencies: ['r3'], uptime: 99.5 },
    ],
  },
  {
    id: 'p4',
    name: 'AutoMakers Inc',
    sector: 'Manufacturing',
    services: [
      { id: 'm1', name: 'ERP System', type: 'Application', criticality: 'Critical', dependencies: [], uptime: 99.9 },
      { id: 'm2', name: 'Supply Chain DB', type: 'Database', criticality: 'High', dependencies: ['m1'], uptime: 99.5 },
      { id: 'm3', name: 'Factory IoT Hub', type: 'Integration', criticality: 'Critical', dependencies: ['m2'], uptime: 99.9 },
      { id: 'm4', name: 'Quality Control AI', type: 'Analytics', criticality: 'Medium', dependencies: ['m3'], uptime: 98.0 },
      { id: 'm5', name: 'Dealer Portal', type: 'Frontend', criticality: 'Medium', dependencies: ['m1'], uptime: 99.0 },
      { id: 'm6', name: 'Parts Inventory', type: 'Microservice', criticality: 'High', dependencies: ['m2'], uptime: 99.5 },
    ],
  },
  {
    id: 'p5',
    name: 'CloudNative Tech',
    sector: 'Tech',
    services: [
      { id: 't1', name: 'User Auth Service', type: 'Security', criticality: 'Critical', dependencies: [], uptime: 99.99 },
      { id: 't2', name: 'Main API Gateway', type: 'API', criticality: 'Critical', dependencies: ['t1'], uptime: 99.95 },
      { id: 't3', name: 'Profile Service', type: 'Microservice', criticality: 'High', dependencies: ['t2', 't4'], uptime: 99.9 },
      { id: 't4', name: 'User Data Store', type: 'Database', criticality: 'Critical', dependencies: [], uptime: 99.99 },
      { id: 't5', name: 'Search Index', type: 'Database', criticality: 'Medium', dependencies: ['t4'], uptime: 99.0 },
      { id: 't6', name: 'Search API', type: 'API', criticality: 'High', dependencies: ['t2', 't5'], uptime: 99.5 },
      { id: 't7', name: 'Analytics Pipeline', type: 'Analytics', criticality: 'Low', dependencies: ['t4'], uptime: 98.0 },
      { id: 't8', name: 'Web Dashboard', type: 'Frontend', criticality: 'High', dependencies: ['t2'], uptime: 99.5 },
      { id: 't9', name: 'Billing Service', type: 'Microservice', criticality: 'Critical', dependencies: ['t2'], uptime: 99.9 },
    ],
  },
];
