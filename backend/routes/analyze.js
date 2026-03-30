import express from 'express';
import { z } from 'zod';
import { analyzePortfolio } from '../services/waveEngine.js';

const router = express.Router();

const analyzeSchema = z.object({
  portfolio: z.object({
    id: z.string(),
    name: z.string(),
    sector: z.string(),
    services: z.array(z.object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
      criticality: z.enum(['low', 'medium', 'high', 'critical']),
      dependencies: z.array(z.string()),
      uptimeSLA: z.number()
    }))
  })
});

router.post('/', async (req, res) => {
  try {
    const parsed = analyzeSchema.parse(req.body);
    const result = await analyzePortfolio(parsed.portfolio);
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation Error', code: 'VALIDATION_ERROR', details: error.errors });
    }
    if (error.code === 'CYCLE_DETECTED') {
      return res.status(400).json({ error: error.message, code: 'CYCLE_DETECTED', details: error.details });
    }
    res.status(500).json({ error: error.message, code: 'ANALYZE_ERROR', details: null });
  }
});

export default router;
