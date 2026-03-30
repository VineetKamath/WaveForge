import express from 'express';
import { z } from 'zod';
import { getMigrationSteps } from '../utils/claude.js';

const router = express.Router();

const migrateSchema = z.object({
  service: z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    criticality: z.string(),
    dependencies: z.array(z.string()),
    uptimeSLA: z.number()
  }),
  provider: z.string()
});

router.post('/', async (req, res) => {
  try {
    const parsed = migrateSchema.parse(req.body);
    const result = await getMigrationSteps(parsed.service, parsed.provider);
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation Error', code: 'VALIDATION_ERROR', details: error.errors });
    }
    res.status(500).json({ error: error.message, code: 'MIGRATE_ERROR', details: null });
  }
});

export default router;
