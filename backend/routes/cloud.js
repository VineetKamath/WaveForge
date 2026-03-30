import express from 'express';
import { z } from 'zod';
import { getCloudRecommendation } from '../utils/claude.js';

const router = express.Router();

const cloudSchema = z.object({
  service: z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    criticality: z.string(),
    dependencies: z.array(z.string()),
    uptimeSLA: z.number()
  })
});

router.post('/', async (req, res) => {
  try {
    const parsed = cloudSchema.parse(req.body);
    const result = await getCloudRecommendation(parsed.service);
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation Error', code: 'VALIDATION_ERROR', details: error.errors });
    }
    res.status(500).json({ error: error.message, code: 'CLOUD_ERROR', details: null });
  }
});

export default router;
